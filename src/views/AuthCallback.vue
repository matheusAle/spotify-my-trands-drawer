<template>
    <div></div>
</template>
<script>
import {SET_AUTH} from "../store";

export default {
    created() {
        const searchParams = new URLSearchParams(location.href.split(/[?|#]/g)[1]);
        this.$store.commit(SET_AUTH, {
            access_token: searchParams.get('access_token'),
            token_type: searchParams.get('token_type'),
            expires_in: parseInt(searchParams.get('expires_in'), 10),
        });
        this.$router.replace('app');
    }
}
</script>
<style scoped lang="scss">

</style>
