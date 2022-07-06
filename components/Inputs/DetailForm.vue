<template>
  <div>
    <h3>詳細フォーム</h3>
    <form>
        food_name <input v-model="food_name" placeholder="food_name"><br>
        amount <input v-model="amount" placeholder="amount"><br>
        price <input v-model="price" placeholder="price"><br>
        subtotal <input v-model="subtotal" placeholder="subtotal"><br>
    </form>
  </div>
</template>
<script>
export default {
  name: 'detail-form',
  props: {
    food_name: String,
    amount: Number,
    price: Number,
    subtotal: Number
  }
};
</script>
<style></style>
