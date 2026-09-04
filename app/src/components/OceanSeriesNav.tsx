/**
 * Shared Ocean Series top nav (portal / A / B / C / D).
 * Markup matches https://wangdwn.github.io/ — B 经营 is current on this app.
 */
export default function OceanSeriesNav() {
  return (
    <nav className="os-nav" aria-label="海洋系列">
      <div className="os-nav__inner">
        <a className="os-nav__brand" href="https://wangdwn.github.io/">
          <span className="os-nav__mark" aria-hidden="true" />
          <span className="os-nav__brand-text">海洋系列</span>
        </a>
        <div className="os-nav__pills">
          <a
            className="os-nav__pill os-nav__pill--a"
            href="https://wangdwn.github.io/guangzhou-marine-enterprises/"
          >
            A 家底
          </a>
          <a
            className="os-nav__pill os-nav__pill--b is-current"
            href="https://wangdwn.github.io/marine-monitor/"
            aria-current="page"
          >
            B 经营
          </a>
          <a
            className="os-nav__pill os-nav__pill--c"
            href="https://wangdwn.github.io/guangzhou-ocean-dashboard/"
          >
            C 质量
          </a>
          <a
            className="os-nav__pill os-nav__pill--d"
            href="https://wangdwn.github.io/marine-weekly/"
          >
            D 底座
          </a>
        </div>
        <a className="os-nav__ds" href="https://wangdwn.github.io/design-system/">
          设计系统
        </a>
      </div>
    </nav>
  );
}
