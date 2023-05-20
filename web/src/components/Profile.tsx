import { getUser } from '@/lib/authUser'
import Image from 'next/image'

export function Profile() {
  const { name, avatarUrl } = getUser()
  return (
    <div className="flex items-center gap-3 text-left">
      {/* User Picture */}

      <Image
        src={avatarUrl}
        width={40}
        height={40}
        alt=""
        className="h-10 w-10 rounded-full"
      />
      {/* Sign in Text */}
      <p className="max-w-[140px] text-sm leading-snug">{name}</p>
    </div>
  )
}