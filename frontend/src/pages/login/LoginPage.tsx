import { type ReactElement, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  IconButton,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
  VStack,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { authStore } from '../../entities/auth'
import { Show } from '../../shared/ui/Show'
import styles from './LoginPage.module.css'

const loginSchema = z.object({
  email: z.string().min(1, 'Введите email').email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль').min(6, 'Минимум 6 символов'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const LoginPage = observer(function LoginPage(): ReactElement {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  })

  const onSubmit: SubmitHandler<LoginFormValues> = (values) => {
    void authStore.login(values.email, values.password)
  }

  const handleTogglePassword = (): void => {
    setShowPassword((prev) => !prev)
  }

  const isLoading = authStore.status === 'loading'

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <CardHeader className={styles.header}>
          <Heading size="lg">RieltAr</Heading>
          <Text className={styles.subtitle}>
            Войдите в систему управления арендой
          </Text>
        </CardHeader>

        <CardBody>
          <VStack
            as="form"
            spacing={4}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <Show when={authStore.error}>
              <Alert status="error" className={styles.alert}>
                <AlertIcon />
                <AlertDescription className={styles.alertText}>
                  {authStore.error}
                </AlertDescription>
                <CloseButton onClick={authStore.clearError.bind(authStore)} />
              </Alert>
            </Show>

            <FormControl isInvalid={!!errors.email}>
              <Input
                {...register('email')}
                type="email"
                placeholder="Email"
                autoComplete="email"
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <InputGroup>
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Пароль"
                  autoComplete="current-password"
                />
                <InputRightElement>
                  <IconButton
                    aria-label={
                      showPassword ? 'Скрыть пароль' : 'Показать пароль'
                    }
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    size="sm"
                    onClick={handleTogglePassword}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              className={styles.submitButton}
              isLoading={isLoading}
              isDisabled={!isValid}
            >
              Войти
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </div>
  )
})

export default LoginPage
