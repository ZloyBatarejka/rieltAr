import { Badge, type BadgeProps } from '@consta/uikit/Badge'

export function StyledBadge({ status, label, size }: BadgeProps) {
  return (
    <Badge
      status={status}
      label={label}
      size={size}
      style={{
        width: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  )
}
