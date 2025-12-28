const navItems = {
  headerNavs: [
    {
      label: 'Home',
      name: 'home'
    },
    {
      label: 'About Us',
      name: 'about-us',
      sub_items: [
        {
          label: 'About Kaleb Accadamy',
          name: 'about-us',
          id: 'about_section'
        },
        {
          label: 'Board of Directories',
          name: 'management',
          id: 'bod_section'
        },

        // {
        //   label: 'Achievements',
        //   name: 'achievements'
        // },
        {
          label: 'Gallery',
          name: 'open-gallery'
        },
        // {
        //   label: 'Video',
        //   name: 'videos'
        // },
        {
          label: 'Organizational Structure',
          name: 'structure',
          id: 'structure_section'
        }
        // {
        //   label: 'Loan calculation and tools',
        //   name: 'Loan'
        // },
        // {
        //   label: 'Contact Us',
        //   name: 'contact-us',
        //   id: "contact"
        // }
      ]
    },
    {
      label: 'Products & Services',
      name: 'services'
    },
    {
      label: 'Work with Us',
      sub_items: [
        {
          label: 'Vacancy',
          name: 'careers'
        },
    //     {
    //       label: 'Partnership',
    //       name: 'partnership'
    //     },

    //     {
    //       label: 'FAQs',
    //       name: 'open-faqs'
    //     }
      ]
    },
    { label: 'Careers', name: 'careers' },
    {
      label: 'News',
      name: 'news'
    },
    {
      label: 'FAQs',
      name: 'open-faqs'
    },
    {
      label: 'Contact Us',
      name: 'contact-us'
    }
  ]
}

export default navItems
