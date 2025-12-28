<template>
  <section class="w-full px-[1%] md:px-[5%] py-4 md:py-12 text-[16px] bg-[#288fb2]/10 service">
    <div class="flex flex-col">
      <h1 class="text-xl font-bold">Pages</h1>
    </div>
    <ul class="text-sm">
      <li class="list-disc list-inside">
        <router-link to="/">{{ $t('Home') }}</router-link>
      </li>
      <li class="list-disc list-inside">
        <router-link to="/services">{{ $t('Services') }}</router-link>
      </li>
      <li class="list-disc list-inside">
        <router-link to="/careers">{{ $t('Careers') }}</router-link>
      </li>
      <li class="list-disc list-inside">
        <router-link to="/news">{{ $t('News') }}</router-link>
      </li>
      <li class="list-disc list-inside">
        <router-link to="/faqs">{{ $t('FAQs') }}</router-link>
      </li>
      <li class="list-disc list-inside">
        <router-link to="/contact-us">{{ $t('Contact Us') }}</router-link>
      </li>
      <li class="list-disc list-inside">
        <router-link to="/">{{ $t('Privacy Policy') }}</router-link>
      </li>
      <li class="list-disc list-inside">
        <router-link to="/about">{{ $t('About Us') }}</router-link>
      </li>
      <li class="list-disc list-inside">
        <router-link to="/sitemap">{{ $t('Sitemap') }}</router-link>
      </li>

      <li class="list-disc list-inside">
        <router-link to="/">{{ $t('Terms and conditions') }}</router-link>
      </li>
    </ul>
  </section>
</template>
