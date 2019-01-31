<template>
  <div class="crawler">
    <h2>과자 검색</h2>
    <div id="search">
      <v-flex>
          <v-text-field v-model="snackName"
            label="과자 이름을 입력 해 주세요"
            outline>
            </v-text-field>
        </v-flex>
      <v-btn
      id="btn-search"
      :loading="loading3"
      :disabled="loading3"
      color="blue-grey"
      class="white--text"
      @click="click">
      Search
      <v-icon right dark>search</v-icon>
    </v-btn>
    </div>
    <div id="grid">
      <div v-for="site in data">
        <div v-if="site.status">
          <h3><a target="_blank" v-bind:href="site.link">{{ site.site }}</a></h3>
          <p><a target="_blank" v-bind:href="site.data[0].link">{{ site.data[0].name }} <br>  :: {{ site.data[0].price }}원</a></p><br>
        </div>
        
      </div>
    </div>
    
    <div v-for="site in data">
      <div v-if="site.status">
        <h2><a target="_blank" v-bind:href="site.link">{{ site.site }}</a></h2>
        <ul v-for="item in site.data">
          <li><a target="_blank" v-bind:href="item.link">{{ item.name }} : {{ item.price }}원</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
#grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  margin: 0px;
}
#search {
  display : grid;
  grid-template-columns: auto auto;
}
#btn-search {
  width: 30%;
}
p {
  margin : 0px;
}
input {
  width: 600px;
}
a {
  color: black;
  text-decoration: none;
}
ul {
  margin: 10px;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

<script>
export default {
  data () {
    return {
      loader: null,
      loading3: false,
      message : "",
      snackName: "",
      progress : false,
      data: []
    }
  },

  methods : {
    click : function (event) {
      if (event) {
        if (this.snackName != "" ) {
          this.loader = 'loading3'
          const l = this.loader
          this[l] = !this[l]
          this.progress = true;
          var btn = document.getElementById('btn-search');
          btn.disabled = true
          this.$http.get('api/crawler/'+ this.snackName)
          .then((response)=> {
            
            this[l] = false
            this.loader = null
            this.progress = false;
            btn.disabled = false
            console.log(response.data)
            this.data = response.data
          })
        } else {
          this.message = "과자 이름이 비어있어요 !"
        }
      }
    }
  }

}
</script>
