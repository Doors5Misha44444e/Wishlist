document.addEventListener('DOMContentLoaded', () => {
    // Тут пишемо код
    const wishForm = document.querySelector('#wish-form');
    const wishName = document.querySelector('#wish-name');
    const wishLink = document.querySelector('#wish-link');
    const wishPrice = document.querySelector('#wish-price');
    const wishList = document.querySelector('#wish-list-container');
   
   let wishes =[];
   
   function renderWishes() {
    wishList.innerHTML =''  ;
    for (let i=0; i <wishes.length; i+=1 ){
        let wish = wishes[i];
       const wishHTML =`
       <div class ="wish-item">
       <h3>${wish.name}</h3>
       ${wish.price &&  `<p>${wish.price} грн</p>`}
      ${wish.link &&  `<a class="shop-btn"  target="_blank" href="${wish.link}">До магазину</a>`}
       </div>
       
       `;
       wishList.innerHTML +=wishHTML;
       
   }}
   
  wishForm.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('Додаємо бажання ' + wishName.value)
        const newWish = {
            name: wishName.value,
            link: wishLink.value,
            price: wishPrice.value
        }
        wishes.push(newWish);
        renderWishes();
        wishForm.reset()
    });
});
