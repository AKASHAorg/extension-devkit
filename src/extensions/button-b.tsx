import React from 'react';
import { withProviders } from '@akashaorg/ui-core-hooks';
import { IRootExtensionProps } from '@akashaorg/typings/lib/ui';
import { Button } from '../components/ui/button';

const Component: React.FC<IRootExtensionProps> = () => {
  const handleButtonClick = () => {
    console.log('Button B clicked');
  };

  return (
    <Button
      style={{ backgroundColor: 'mediumpurple' }}
      variant="outline"
      size="icon"
      onClick={handleButtonClick}
    >
      B
    </Button>
  );
};

const LikeButton = (props: IRootExtensionProps) => {
  return <Component {...props} />;
};
export default withProviders(LikeButton);
