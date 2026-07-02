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
  const roleLevel = useMemo(() => {
    if (!user) return 0; // guest
    if (user.role === 'admin') return 3;
    if (user.role === 'vip') return 2;
    if (user.role === 'user') return 1;
    return 0;
  }, [user?.role]);

  // 判断是否有权限访问指定级别内容
  const canAccess = useCallback((level: 'user' | 'vip') => {
    if (level === 'user') return roleLevel >= 1;
    if (level === 'vip') return roleLevel >= 2;
    return false;
  }, [roleLevel]);

  // 兼容旧代码的 isAdmin
  const isAdmin = user?.role === 'admin';

  // 将后端 role 标准化（后端可能返回不同格式）
  const normalizedRole: UserRole = useMemo(() => {
    if (!user) return 'guest';
    const r = user.role?.toLowerCase();
    if (r === 'admin') return 'admin';
    if (r === 'vip') return 'vip';
    if (r === 'user') return 'user';
    return 'user'; // 已登录但无特定角色默认为 user
  }, [user?.role]);

  return useMemo(() => ({
    user: user ? { ...user, role: normalizedRole } : null,
    isAuthenticated: !!user,
    isAdmin,
    isVIP: normalizedRole === 'vip',
    isGuest: !user,
    role: normalizedRole,
    roleLevel,
    canAccess,
    isLoading: isLoading || logoutMutation.isPending,
    error,
    logout,
    refresh: refetch,
  }), [
    user, normalizedRole, isAdmin, roleLevel, canAccess,
    isLoading, logoutMutation.isPending, error, logout, refetch
  ]);
}
