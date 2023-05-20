export function EmptyMemories() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="w-[360px] text-center leading-relaxed">
        Você ainda não registrou nenhuma lembrança, comece a{' '}
        {/* Esse {' '} é uma forma de forçar a não remover o espaço necessário */}
        <a className="underline hover:text-gray-50" href="">
          criar agora
        </a>
        !
      </p>
    </div>
  )
}
