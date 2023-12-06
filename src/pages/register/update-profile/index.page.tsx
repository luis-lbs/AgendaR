import {
  Heading,
  MultiStep,
  Text,
  Button,
  TextArea,
  Avatar,
} from '@ignite-ui/react'
import { Container, Header, Form } from '../styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormAnnotation } from './styles'
import { useSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

const UpdateProfileSchema = z.object({
  bio: z.string(),
})

type UpdateProfileData = z.infer<typeof UpdateProfileSchema>

export default function UpdateProfile(props: any) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(UpdateProfileSchema),
  })

  const session = useSession()
  const router = useRouter()

  async function handleUpdateProfile(data: UpdateProfileData) {
    await api.put('users/profile', {
      bio: data.bio,
    })

    await router.push(`/schedule/${session.data?.user.username}`)
  }

  return (
    <>
      <NextSeo title="Atualize seu perfil | AgendaR" noindex />

      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao AgendaR!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! ah, você
            pode editar essas informações depois.
          </Text>
          <MultiStep size={4} currentStep={4} />
        </Header>

        <Form as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
          <label>
            <Text size="sm">Foto de perfil</Text>
            <Avatar
              src={session.data?.user.avatar_url}
              alt={session.data?.user.name}
            />
          </label>

          <label>
            <Text size="sm">Sobre você</Text>
            <TextArea
              placeholder="Software Enginer @Google"
              {...register('bio')}
              {...props}
            />
            <FormAnnotation size="sm">Fale um pouco sobre você</FormAnnotation>
          </label>
          <Button type="submit" disabled={isSubmitting}>
            Finalizar <ArrowRight />
          </Button>
        </Form>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  return {
    props: {
      session,
    },
  }
}
