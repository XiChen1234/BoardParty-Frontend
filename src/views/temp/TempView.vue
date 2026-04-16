<script setup lang="ts">
import { login } from '@/api/authAPI'
import { onMounted } from 'vue'

onMounted(async () => {
  try {
    const res = await login({
      username: 'admin',
      password: '123456'
    })

    console.log('login response:', res)

  } catch (err) {
    console.error('login error:', err)
  }
})
</script>
