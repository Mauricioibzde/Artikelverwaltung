export function readSelector () {
    let input_article_name = document.querySelector("#article-name");
    let input_article_quantity = document.querySelector("#article-quantity");
    let input_article_price = document.querySelector("#amount-price");   // corrigido
    let input_article_category = document.querySelector("#category");    // corrigido

    return {
        name: input_article_name.value,
        quantity: input_article_quantity.value,
        price: input_article_price.value,
        category: input_article_category.value
    };
}
