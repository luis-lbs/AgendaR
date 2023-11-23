import { Heading, MultiStep, Text, Button } from '@ignite-ui/react'
import { Container, Header } from '../styles'
import { ArrowRight, Check } from 'phosphor-react'
import { AuthError, ConnectBox, ConnectItem } from './styles'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function ConnectCalendar() {
  const session = useSession()
  const router = useRouter()

  const hasAuthError = !!router.query.error
  const isSignedIn = session.status === 'authenticated'

  const handleConnectCalendar = async () => await signIn('google')
  const handleNextStep = async () =>
    await router.push('/register/time-intervals')

  return (
    <Container>
      <Header>
        <Heading as="strong">Conecte sua agenda!</Heading>
        <Text>
          Conecte seu calendário para verificar automaticamente as horas
          ocupadas e novos eventos á medida que são agendados.
        </Text>
        <MultiStep size={4} currentStep={2} />
      </Header>
      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>
          {isSignedIn ? (
            <Button disabled={true}>
              Conectado <Check />
            </Button>
          ) : (
            <Button variant="secondary" onClick={handleConnectCalendar}>
              Conectar <ArrowRight />
            </Button>
          )}
        </ConnectItem>

        {hasAuthError && (
          <AuthError size="sm">
            Falha ao se conectar ao Google, verifique se você habilitou as
            permissões de acesso ao Google Calendar
          </AuthError>
        )}

        <Button type="submit" disabled={!isSignedIn} onClick={handleNextStep}>
          Próximo passo <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}
