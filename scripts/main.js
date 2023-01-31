


Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        },
        cart: {
            type: Number
        },
    },
    template: `
    <div class="product">
            <div class="product-image">
                <img :src="image" :alt="altText" />
            </div>
            <div class="product-info">
                <h1>{{ sale }}</h1>
                <p>{{ description  }}</p>
                <product-details :details="details"></product-details>
                <p v-if="variants[this.selectedVariant].variantQuantity > 10">In stock</p>
                <p v-else-if="variants[this.selectedVariant].variantQuantity <= 10 && variants[this.selectedVariant].variantQuantity > 0">Almost sold out!</p>
                <p v-else :class="{ out_of_stock: !inStock }">Out of stock</p>
                <div
                        class="color-box"
                        v-for="(variant, index) in variants"
                        :key="variant.variantId"
                        :style="{ backgroundColor:variant.variantColor }"
                        @mouseover="updateProduct(index)"
                >
                </div>
                <ul>
                    <li v-for="size in sizes" :key="sizes">{{size}}</li>
                </ul>
                <p>Shipping: {{ shipping }}</p>
                <button @click="addToCart"
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock }">Add to cart</button>
                <button @click="removeFromCart">Remove from cart</button><br>
                <a :href="link">More products like this</a>
                <div>
                    <h2>Reviews</h2>
                    <p v-if="!reviews.length">There are no reviews yet.</p>
                    <ul>
                        <li v-for="review in reviews">
                            <p>{{ review.name }}</p>
                            <p>Rating: {{ review.rating }}</p>
                            <p>{{ review.review }}</p>
                        </li>
                    </ul>
                </div>

                <product-review @review-submitted="addReview"></product-review>
            </div>

        </div>
 `,

    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm, fuzzy socks",
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            onSale: true,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 0
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 10
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            reviews: [],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        removeFromCart(){
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        }

    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale(){
            onsale = '';
            if (this.onSale){
                onsale = 'ON SALE';
            }
            return this.brand + ' ' + this.product + ' ' + onsale;
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }

    }
})

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
        }
    },
    template: `
    <div class="product-details">
        <span>Details:</span>
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>   
    </div>
    `,
})

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
       <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
       </p>

     <p>
       <label for="name">Name:</label>
       <input id="name" v-model="name" placeholder="name" >
     </p>

     <p>
       <label for="review">Review:</label>
       <textarea id="review" v-model="review" ></textarea>
     </p>

     <p>
       <label for="rating">Rating:</label>
       <select id="rating" v-model.number="rating">
         <option>5</option>
         <option>4</option>
         <option>3</option>
         <option>2</option>
         <option>1</option>
       </select>
     </p>
     <p>
         <p>Would you recommend this product?</p>
         <input v-model="recommend" class="radioRec" type="radio" id="choice1"
                    name="recommend" value="yes">
         <label for="choice1">Yes</label>
                
         <input v-model="recommend" class="radioRec" type="radio" id="choice2"
                    name="recommend" value="no">
         <label for="choice2">No</label>
         
     </p>

     <p>
       <input type="submit" value="Submit"> 
     </p>

    </form>

 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: [],
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend,
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            } else {
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required.")
                if (!this.recommend) this.errors.push("Recommend required.")
            }

        },
    }

})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        deleteCart(id) {
            if(this.cart.includes(id)) {
                this.cart.splice(this.cart.indexOf(id), 1)
            }
        }
    },
})