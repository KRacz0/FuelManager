import orlenLogoImage from '@/assets/Orlen_Logo.png'
import bpLogoImage from '@/assets/BP_Logo.png'
import shellLogoImage from '@/assets/Shell_Logo.png'
import lotosLogoImage from '@/assets/Lotos_Logo.png'
import dpLogoImage from '@/assets/DP_Logo.png'
import pieprzykLogoImage from '@/assets/Pieprzyk_Logo.png'
import cenyPaliwekLogoImage from '@/assets/ceny_paliwek_logo.png'

export function getBrandImage(brand: string) {
  if (brand == 'ORLEN') {
    return orlenLogoImage
  }
  if (brand == 'BP') {
    return bpLogoImage
  }
  if (brand == 'SHELL') {
    return shellLogoImage
  }
  if (brand == 'LOTOS') {
    return lotosLogoImage
  }
  if (brand == 'DP') {
    return dpLogoImage
  }
  if (brand == 'PIEPRZYK') {
    return pieprzykLogoImage
  }
  return cenyPaliwekLogoImage
}
