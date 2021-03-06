const config = {
    flow: 'boring',
    languages: {
        eng: 'English',
        spa: 'Spanish',
        fre: 'French'
    }
};

module.exports =
    process.env.NODE_ENV === 'production'
        ? Object.assign({}, config, {
              localStorage: true,
              endpoints: {
                  flows: 'flows',
                  groups: 'groups',
                  contacts: 'contacts',
                  fields: 'fields',
                  activity: '',
                  engine: ''
              }
          })
        : Object.assign({}, config, {
              localStorage: true,
              endpoints: {
                  flows: '/assets/flows',
                  groups: '/assets/groups',
                  contacts: '/assets/contacts',
                  fields: '/assets/fields',
                  activity: '',
                  engine: ''
              }
          });
