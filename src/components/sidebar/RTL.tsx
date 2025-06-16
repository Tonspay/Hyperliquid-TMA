/* eslint-disable */

import { HiX } from 'react-icons/hi';
import Links from './components/Links';

import SidebarCard from 'components/sidebar/components/SidebarCard';
import {
  renderThumb,
  renderTrack,
  renderView,
} from 'components/scrollbar/Scrollbar';
import { Scrollbars } from 'react-custom-scrollbars-2';
import avatar4 from '/public/img/avatars/avatar4.png';
import routes from 'routes';
import Card from 'components/card';
import Image from 'next/image';

function SidebarHorizon(props: { variant?: string; [x: string]: any }) {
  const { open, onClose, variant, mini, hovered, setHovered } = props;
  return (
    <div
      className={`sm:none ${
        mini === false
          ? 'w-[285px]'
          : mini === true && hovered === true
          ? 'w-[285px]'
          : 'w-[285px] xl:!w-[120px]'
      } duration-175 linear fixed !z-50 min-h-full transition-all md:!z-50 lg:!z-50 xl:!z-0 ${
        variant === 'auth' ? 'xl:hidden' : 'xl:block'
      } ${open ? '' : '-translate-x-[105%] xl:translate-x-[unset]'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card
        extra={`mr-3 w-full h-[96.5vh] sm:ml-4 sm:my-4 m-7 !rounded-[20px]`}
      >
      </Card>
    </div>
  );
}

export default SidebarHorizon;
