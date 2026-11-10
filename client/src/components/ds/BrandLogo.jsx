import { memo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base';

/** Brand mark + site name. Name comes from siteSettings.site_info.websiteName (fallback "Portfolio"). */
const BrandLogo = ({ className = '' }) => {
  const siteName =
    useSelector((state) => state.siteSettings?.site_info?.websiteName) || 'Portfolio';

  return (
    <Link
      to="/"
      aria-label={`${siteName} — go to home page`}
      className={`group flex min-w-0 items-center gap-2.5 rounded-lg ${FOCUS_RING} ${className}`}
    >
      <span
        aria-hidden="true"
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-brand-cyan/30 bg-brand-cyan/10 text-sm font-bold text-brand-cyan transition-colors duration-300 group-hover:bg-brand-cyan/20 motion-reduce:transition-none"
      >
        {siteName.charAt(0).toUpperCase()}
      </span>
      <span className="truncate font-sans text-base font-semibold tracking-tight text-ink sm:text-lg">
        {siteName}
      </span>
    </Link>
  );
};

export default memo(BrandLogo);
