import useBrowserWindow from 'hooks/useBrowserWindow';
import useForceRerender from 'hooks/useForceRerender';
import React, { useEffect, useState } from 'react';
import app from 'state';
import useSidebarStore from 'state/ui/sidebar';
import 'Sublayout.scss';
import { Sidebar } from 'views/components/sidebar';
import { AppMobileMenus } from './AppMobileMenus';
import { Footer } from './Footer';
import { SublayoutBanners } from './SublayoutBanners';
import { SublayoutHeader } from './SublayoutHeader';

type SublayoutProps = {
  hideFooter?: boolean;
  hasCommunitySidebar?: boolean;
} & React.PropsWithChildren;

const Sublayout = ({
  children,
  hideFooter = true,
  hasCommunitySidebar,
}: SublayoutProps) => {
  const forceRerender = useForceRerender();
  const { menuVisible, mobileMenuName, userToggledVisibility } =
    useSidebarStore();
  const [resizing, setResizing] = useState(false);
  const { isWindowSmallInclusive } = useBrowserWindow({
    onResize: () => setResizing(true),
    resizeListenerUpdateDeps: [resizing],
  });
  const { setMenu } = useSidebarStore();

  useEffect(() => {
    app.sidebarRedraw.on('redraw', forceRerender);

    return () => {
      app.sidebarRedraw.off('redraw', forceRerender);
    };
  }, [forceRerender]);

  useEffect(() => {
    let timer;
    if (resizing) {
      timer = setTimeout(() => {
        setResizing(false);
      }, 200); // adjust delay as needed
    }
    return () => {
      clearTimeout(timer);
    };
  }, [resizing]);

  useEffect(() => {
    if (
      localStorage.getItem('dark-mode-state') === 'on' &&
      localStorage.getItem('user-dark-mode-state') === 'on'
    ) {
      document.getElementsByTagName('html')[0].classList.add('invert');
    }

    const onResize = () => {
      if (userToggledVisibility === null) {
        setMenu({ name: 'default', isVisible: !isWindowSmallInclusive });
      }
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const chain = app.chain ? app.chain.meta : null;
  const terms = app.chain ? chain.terms : null;
  const banner = app.chain ? chain.communityBanner : null;

  return (
    <div className="Sublayout">
      <div className="header-and-body-container">
        <SublayoutHeader onMobile={isWindowSmallInclusive} />
        <div className="sidebar-and-body-container">
          <Sidebar isInsideCommunity={hasCommunitySidebar} />
          <div
            className={`body-and-sticky-headers-container 
            ${menuVisible ? 'menu-visible' : 'menu-hidden'} 
            ${resizing ? 'resizing' : ''}`}
          >
            <SublayoutBanners banner={banner} chain={chain} terms={terms} />

            {isWindowSmallInclusive && mobileMenuName ? (
              <AppMobileMenus />
            ) : (
              <div className="Body">
                {children}
                {!app.isCustomDomain() && !hideFooter && <Footer />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sublayout;
