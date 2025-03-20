import React from 'react';
import { withProviders } from '@akashaorg/ui-core-hooks';
import { IRootExtensionProps } from '@akashaorg/typings/lib/ui';
import { Button } from '../components/ui/button';

const Component: React.FC<IRootExtensionProps> = () => {
  const handleButtonClick = () => {
    console.log('Button A clicked');
  };

  return (
    <Button
      style={{ backgroundColor: 'lightslategray' }}
      variant="outline"
      size="icon"
      onClick={handleButtonClick}
    >
      A
    </Button>
  );
};

const ButtonA = (props: IRootExtensionProps) => {
  return <Component {...props} />;
};
export default withProviders(ButtonA);
