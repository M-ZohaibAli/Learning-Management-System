import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

function currentHash() {
  const h = window.location.hash.replace(/^#/, "");
  return h || "/";
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(currentHash());

  useEffect(() => {
    const onChange = () => {
      setPath(currentHash());
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = (to: string) => {
    window.location.hash = to;
  };

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within RouterProvider");
  return ctx;
}

export function useRoute() {
  const { path } = useRouter();
  const segments = path.split("/").filter(Boolean);
  return { path, segments };
}

interface LinkProps {
  to: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

export function Link({ to, className, children, onClick }: LinkProps) {
  const { navigate } = useRouter();
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}