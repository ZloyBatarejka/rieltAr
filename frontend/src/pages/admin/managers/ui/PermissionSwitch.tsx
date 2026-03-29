import { Switch } from '@consta/uikit/Switch'

interface PermissionSwitchProps {
  value: boolean
  onChange: (value: boolean) => void
}

export const PermissionSwitch: React.FC<PermissionSwitchProps> = ({
  value,
  onChange,
}) => {
  return (
    <Switch
      size="s"
      checked={value}
      onChange={(e) => onChange(e.target.checked)}
    />
  )
}
