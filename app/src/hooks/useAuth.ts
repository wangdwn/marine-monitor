import { trpc } from "@/providers/trpc";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { LOGIN_PATH } from "@/const";

// 扩展用户角色：guest=浏览版, user=注册版, vip=付费版, admin=管理员
export type UserRole = 'guest' | 'user' | 'vip' | 'admin';

export function useAuth(options?: {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
  requiredLevel?: 'user' | 'vip';
}) {
  const { redirectOnUnauthenticated = false, redirectPath = LOGIN_PATH, requiredLevel } = options ?? {};
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      navigate(redirectPath);
    },
  });

  const logout = useCallback(() => logoutMutation.mutate(), [logoutMutation]);

  useEffect(() => {
    if (redirectOnUnauthenticated && !isLoading && !user) {
      const currentPath = window.location.pathname;
      if (currentPath !== redirectPath) {
        navigate(redirectPath);
      }
    }
  }, [redirectOnUnauthenticated, isLoading, user, navigate, redirectPath]);

  // 判断用户角色级别
  // 整合方案：取消登录界面，默认以管理员身份直接使用（公开访问）
  const roleLevel = 3;
  const isAdmin = true;
  const isVIP = true;
  const normalizedRole: UserRole = 'admin';

  // 后端无会话时，使用虚拟管理员身份（保证全部栏目/内容直接可用）
  const effectiveUser = user ?? {
    id: 0,
    unionId: 'public',
    name: '公开访问',
    email: '',
    role: 'admin',
    avatar: '',
  };

  // 所有内容默认可访问（已取消登录与权限门禁）
  const canAccess = useCallback(() => true, []);

  return useMemo(() => ({
    user: effectiveUser,
    isAuthenticated: true,
    isAdmin: true,
    isVIP: true,
    isGuest: false,
    role: 'admin' as UserRole,
    roleLevel: 3,
    canAccess,
    isLoading: isLoading || logoutMutation.isPending,
    error,
    logout,
    refresh: refetch,
  }), [
    effectiveUser, isLoading, logoutMutation.isPending, error, logout, refetch
  ]);
}
