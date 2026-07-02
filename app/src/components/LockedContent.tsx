import { Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface LockedContentProps {
  /** 所需最小权限：'user' = 注册用户，'vip' = VIP会员 */
  level: 'user' | 'vip';
  children: React.ReactNode;
  /** 未解锁时显示的预览内容 */
  teaser?: React.ReactNode;
  /** 自定义提示文案 */
  label?: string;
  sublabel?: string;
  buttonLabel?: string;
}

export default function LockedContent({
  level,
  children,
  teaser,
  label,
  sublabel,
  buttonLabel,
}: LockedContentProps) {
  const { canAccess, isAuthenticated } = useAuth();

  if (canAccess(level)) return <>{children}</>;

  const defaultLabel = level === 'vip'
    ? 'VIP专属内容'
    : isAuthenticated
      ? '权限不足'
      : '登录后可查看完整内容';

  const defaultSublabel = level === 'vip'
    ? '升级VIP会员解锁全部高级功能'
    : isAuthenticated
      ? '您的账号暂无权访问此内容'
      : '注册账号即享完整访问权限';

  return (
    <div className="relative">
      {/* 预览遮罩 */}
      {teaser && (
        <div className="blur-[3px] opacity-40 pointer-events-none select-none overflow-hidden h-full">
          {teaser}
        </div>
      )}

      {/* 解锁提示浮层 */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="bg-white/95 rounded-2xl p-6 text-center shadow-xl border border-[#E2E5EA] max-w-xs w-full mx-4">
          <div className="w-14 h-14 rounded-full bg-[#1B3A5C]/10 mx-auto mb-3 flex items-center justify-center">
            <Lock className="w-7 h-7 text-[#1B3A5C]" />
          </div>
          <p className="text-base font-semibold text-[#1A1D21] mb-1">
            {label ?? defaultLabel}
          </p>
          <p className="text-xs text-[#6B7280] mb-4 leading-relaxed">
            {sublabel ?? defaultSublabel}
          </p>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                window.location.href = '/login';
              } else if (level === 'vip') {
                // TODO: 跳转 VIP 升级页面
                alert('请联系管理员开通VIP会员');
              }
            }}
            className="w-full px-5 py-2.5 bg-[#1B3A5C] text-white rounded-xl text-sm font-medium hover:bg-[#152D49] transition-colors"
          >
            {buttonLabel ?? (level === 'vip' ? '立即升级VIP' : isAuthenticated ? '联系管理员' : '登录 / 注册')}
          </button>
        </div>
      </div>
    </div>
  );
}
