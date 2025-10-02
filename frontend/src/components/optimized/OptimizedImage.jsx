/**
 * Optimized Image component with lazy loading and performance features
 */
import React, { memo } from 'react';
import { useLazyImage } from '../../hooks/usePerformanceOptimization';
import { cn } from '../../lib/utils';

const OptimizedImage = memo(({
  src,
  alt,
  className,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Im0xNSAxNSA2IDUgNi01djEwSDEwVjE1eiIgZmlsbD0iIzljYTNhZiIvPgo8L3N2Zz4K',
  width,
  height,
  ...props
}) => {
  const { targetRef, imageSrc, isLoaded, isError, hasIntersected } = useLazyImage(src, placeholder);

  return (
    <div
      ref={targetRef}
      className={cn(
        'relative overflow-hidden bg-gray-100',
        className
      )}
      style={{ width, height }}
    >
      <img
        src={imageSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300 object-cover w-full h-full',
          {
            'opacity-0': !isLoaded && hasIntersected,
            'opacity-100': isLoaded,
            'blur-sm': !isLoaded && hasIntersected,
          }
        )}
        loading={hasIntersected ? 'eager' : 'lazy'}
        decoding="async"
        {...props}
      />
      
      {/* Loading spinner */}
      {hasIntersected && !isLoaded && !isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-400 text-sm">Failed to load</div>
        </div>
      )}
      
      {/* Fade-in effect overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-white transition-opacity duration-300',
          {
            'opacity-0 pointer-events-none': isLoaded,
            'opacity-30': !isLoaded && hasIntersected,
          }
        )}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;