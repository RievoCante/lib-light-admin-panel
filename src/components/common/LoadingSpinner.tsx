// Loading spinner component
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  );
}
