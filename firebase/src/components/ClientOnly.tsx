import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { canDisplay } from './routing';

interface Props {
  children: React.ReactNode;
}

const ClientOnly: React.FC<Props> = ({ children, ...delegated }) => {
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter()
  const redirectPolicy = canDisplay()
  useEffect(() => {
    setHasMounted(true);
    if(redirectPolicy == "DontRedirect"){
      return
    }
    router.push(redirectPolicy.url)
  }, [redirectPolicy, router]);

  if (!hasMounted) {
    return null;
  }

  return <div className="pageLayout" {...delegated}>{children}</div>;
};
export default ClientOnly;