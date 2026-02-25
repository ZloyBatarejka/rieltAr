import { Switch } from '@chakra-ui/react'

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
      size="sm"
      isChecked={value}
      onChange={(e) => onChange(e.target.checked)}
    />
  )
}
