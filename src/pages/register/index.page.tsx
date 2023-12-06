import { Heading, MultiStep, Text, TextInput, Button } from '@ignite-ui/react'
import { Container, Header, Form, FormError } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { api } from '@/lib/axios'
import { AxiosError } from 'axios'
import { NextSeo } from 'next-seo'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário pode ter apenas letras e ifens',
    })
    .transform((username) => username.toLowerCase()),

  name: z.string().min(3, { message: 'O nome Precisa ter pelomenos 3 letras' }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register(props: any) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const router = useRouter()

  useEffect(() => {
    if (router.query.username) {
      setValue('username', router.query.username.toString())
    }
  }, [router.query?.username, setValue])

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post('/users', {
        name: data.name,
        username: data.username,
      })
      await router.push('/register/connect-calendar')
    } catch (e) {
      if (e instanceof AxiosError && e?.response?.data?.message) {
        alert(e.response.data.message)
        return
      }
      console.log(e)
    }
  }

  return (
    <>
      <NextSeo title="Crie uma conta | AgendaR" />
      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao AgendaR!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! ah, você
            pode editar essas informações depois.
          </Text>
          <MultiStep size={4} currentStep={1} />
        </Header>

        <Form as="form" onSubmit={handleSubmit(handleRegister)}>
          <label>
            <Text size="sm">Nome de usuário</Text>
            <TextInput
              prefix="AgendaR.com/"
              placeholder="seu-usuario"
              {...register('username')}
              {...props}
            />
            {errors.username && (
              <FormError size="sm">{errors.username.message}</FormError>
            )}
          </label>

          <label>
            <Text size="sm">Nome completo</Text>
            <TextInput
              placeholder="Seu nome"
              {...register('name')}
              {...props}
            />
            {errors.name && (
              <FormError size="sm">{errors.name.message}</FormError>
            )}
          </label>
          <Button type="submit" disabled={isSubmitting}>
            Próximo passo <ArrowRight />
          </Button>
        </Form>
      </Container>
    </>
  )
}
