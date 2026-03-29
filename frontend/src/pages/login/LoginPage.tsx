import { type ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { Button } from '@consta/uikit/Button'
import { Informer } from '@consta/uikit/Informer'
import { IconClose } from '@consta/icons/IconClose'
import { authStore } from '../../entities/auth'
import { Show } from '../../shared/ui/Show'
import styles from './LoginPage.module.css'

const loginSchema = z.object({
  email: z.string().min(1, 'Введите email').email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль').min(6, 'Минимум 6 символов'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const LoginPage = observer(function LoginPage(): ReactElement {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  })

  const onSubmit: SubmitHandler<LoginFormValues> = (values) => {
    void authStore.login(values.email, values.password)
  }

  const isLoading = authStore.status === 'loading'

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <Text view="primary" size="2xl" weight="bold">
            Balivi
          </Text>
          <Text className={styles.subtitle} view="secondary" size="s">
            Войдите в систему управления арендой
          </Text>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <Show when={authStore.error}>
            <div className={styles.alert}>
              <Informer
                status="alert"
                label={authStore.error ?? ''}
                view="bordered"
              />
              <Button
                size="xs"
                view="clear"
                onlyIcon
                iconLeft={IconClose}
                onClick={authStore.clearError.bind(authStore)}
                className={styles.alertClose}
                label="Закрыть"
              />
            </div>
          </Show>

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                value={field.value}
                onChange={field.onChange}
                placeholder="Email"
                type="email"
                status={fieldState.error ? 'alert' : undefined}
                caption={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                value={field.value}
                onChange={field.onChange}
                placeholder="Пароль"
                type="password"
                status={fieldState.error ? 'alert' : undefined}
                caption={fieldState.error?.message}
              />
            )}
          />

          <Button
            type="submit"
            label="Войти"
            className={styles.submitButton}
            loading={isLoading}
            disabled={!isValid}
          />
        </form>
      </Card>
    </div>
  )
})

export default LoginPage
