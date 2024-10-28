import { cn } from '@/lib/utils'
import { memo } from 'react'

const Placeholder = ({
  compact,
  value,
  className,
}: {
  compact?: boolean
  value?: string
  className?: string
}) => {

  return (
    <div className={cn(
      className,
      'absolute top-0 left-0 h-full w-full text-sm text-gray-300 select-none pointer-events-none px-3 py-2',
      compact ? 'leading-5 text-[13px]' : 'leading-6 text-sm',
    )}>
      {value || 'Write your prompt word here, enter \'{\' to insert a variable, enter \'/\' to insert a prompt content block'}
    </div>
  )
}

export default memo(Placeholder)
