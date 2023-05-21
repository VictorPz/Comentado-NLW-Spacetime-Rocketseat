import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { ImageBackground, View, Text, TouchableOpacity } from 'react-native'
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session'
import { styled } from 'nativewind'
import * as SecureStore from 'expo-secure-store'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import blurbg from '../src/assets/bg-blur.png'
import Stripes from '../src/assets/stripes.svg'
import NlwLogo from '../src/assets/nlw-spacetime-logo.svg'
import { api } from '../src/lib/api'
import { useRouter } from 'expo-router'

const StyledStripes = styled(Stripes)

// Func para salvar novos valores no secure store (vamos usar pro token)
async function save(key, value) {
  await SecureStore.setItemAsync(key, value)
}

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/ae046d290c2a208b8f15',
}

export default function App() {
  const router = useRouter()

  /* Doccode */
  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: 'ae046d290c2a208b8f15',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetimevkpz',
      }),
    },
    discovery,
  )

  async function handleGithubOAuthCode(code: string) {
    const response = await api.post('/register', {
      code,
    })

    const { token } = response.data
    console.log(token)
    await save('token', token) // salvamos o token no secure store ps: Professor fez SecureStore.setItemAsync('token', token)
    router.push('./memories')
  }

  // useEffect() no react é uma função que nos permite monitorar a mudança de valor numa variável
  useEffect(() => {
    // Se der algum erro no endereço e não voltar o code, roda isso e ve qual é a url para substituir no github oauth
    // console.log(
    //   makeRedirectUri({
    //     scheme: 'nlwspacetimevkpz',
    //   }),
    // )

    if (response?.type === 'success') {
      const { code } = response.params

      // Aqui chamamos o backend
      handleGithubOAuthCode(code)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response])

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  if (!hasLoadedFonts) {
    return null
  }

  return (
    <ImageBackground
      source={blurbg}
      className="relative flex-1 items-center bg-gray-900 px-8 py-10"
      imageStyle={{
        position: 'absolute',
        left: '-100%',
      }}
    >
      <StyledStripes className="absolute left-2" />

      <View className="flex-1 items-center justify-center gap-6">
        <NlwLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>

          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-3"
          onPress={() => signInWithGithub()} // chama essa signIn lá do useAuthRequest
        >
          <Text className="font-alt text-sm uppercase text-black">
            COMEÇAR A CADASTRAR
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>

      <StatusBar style="light" translucent />
    </ImageBackground>
  )
}
