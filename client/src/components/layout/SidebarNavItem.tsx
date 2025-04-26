import { Link, useLocation } from 'wouter';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarNavItemProps {
  children: React.ReactNode;
  href: string;
  icon: LucideIcon;
  indented?: boolean;
}

export default function SidebarNavItem({ children, href, icon: Icon, indented }: SidebarNavItemProps) {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href}>
      <a
        className={cn(
          'flex items-center py-2 px-3 rounded-md transition-colors font-medium',
          indented && 'ml-6',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
        )}
      >
        <Icon className="h-5 w-5 mr-3" />
        <span>{children}</span>
      </a>
    </Link>
  );
}