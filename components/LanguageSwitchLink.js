import languageDetector from '../lib/languageDetector'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { GB, ES, DE } from 'country-flag-icons/react/3x2'

const LanguageSwitchLink = ({ locale, ...rest }) => {
  const router = useRouter()
  const languageOptions = [
    { label: 'English', flag: <GB className="w-10 mx-auto" />, locale: 'en' },
    { label: 'Spanish', flag: <ES className="w-10 mx-auto" />, locale: 'es' },
    { label: 'Germany', flag: <DE className="w-10 mx-auto" />, locale: 'de' },
  ];

  let href = rest.href || router.asPath
  let pName = router.pathname
  Object.keys(router.query).forEach((k) => {
    if (k === 'locale') {
      pName = pName.replace(`[${k}]`, locale)
      return
    }
    pName = pName.replace(`[${k}]`, router.query[k])
  })
  if (locale) {
    href = rest.href ? `/${locale}${rest.href}` : pName
  }

  return (
    <Link
      className='block px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
      href={href}
      onClick={() => languageDetector.cache(locale)}
    >
      <button style={{ fontSize: 'small' }}>{locale === 'en' ? languageOptions[0].flag : locale === 'es' ? languageOptions[1].flag : languageOptions[2].flag}</button>
    </Link>
  );
};

export default LanguageSwitchLink