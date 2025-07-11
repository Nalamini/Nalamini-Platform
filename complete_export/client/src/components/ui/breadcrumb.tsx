import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  separator?: React.ReactNode;
}

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
  current?: boolean;
  children: React.ReactNode;
}

export interface BreadcrumbLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

const BreadcrumbContext = React.createContext<{ separator: React.ReactNode }>({
  separator: <ChevronRight className="h-4 w-4" />,
});

export function Breadcrumb({
  children,
  separator = <ChevronRight className="h-4 w-4" />,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <BreadcrumbContext.Provider value={{ separator }}>
      <nav
        aria-label="breadcrumb"
        className={cn("flex text-sm", className)}
        {...props}
      >
        <ol className="flex items-center gap-1">{children}</ol>
      </nav>
    </BreadcrumbContext.Provider>
  );
}

export function BreadcrumbItem({
  children,
  current,
  className,
  ...props
}: BreadcrumbItemProps) {
  const { separator } = React.useContext(BreadcrumbContext);
  
  return (
    <li
      className={cn("inline-flex items-center gap-1.5", className)}
      aria-current={current ? "page" : undefined}
      {...props}
    >
      {children}
      {!current && <span className="text-gray-400">{separator}</span>}
    </li>
  );
}

export function BreadcrumbLink({
  children,
  className,
  asChild = false,
  ...props
}: BreadcrumbLinkProps) {
  const Comp = asChild ? React.Fragment : "a";
  
  return (
    <Comp
      className={cn(
        "text-gray-500 hover:text-primary transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}