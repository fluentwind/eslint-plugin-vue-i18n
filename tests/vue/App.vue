<template>
  <div id="app" :title="$t('title.attr')">
    {{$t('atb.123')}}
    {{$t(abc + 'atb1.123')}}
    {{$t('atbtitle2.' + abc)}}
    {{$t(`atb3.${abc}`)}}
  </div>
</template>

<script>

  export default {
    name: 'App',
    computed: {
      test() {
        return this.$t('submit2');
      }
    },
  };
</script>
