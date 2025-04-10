$(document).ready(function() {

    function loadProducts() {
        $.get("https://fakestoreapi.com/products", function(products) {
            let productListHTML = "";
            products.forEach(product => {
                productListHTML += `
                     <div class="product-card" data-title="${product.title.toLowerCase()}">
                        <img src="${product.image}" width="100">
                        <h3>${product.title}</h3>
                        <p>${product.price} $</p>
                        <button class="addToCart">Add to Cart</button>
                        <button class="showDetails" 
                            data-title="${product.title}" 
                            data-image="${product.image}" 
                            data-price="${product.price}" 
                            data-description="${product.description}">
                            Show Details
                        </button>
                    </div>
                `;
            });

            $("#productList").html(productListHTML);

            if ($("#productList").hasClass("slick-initialized")) {
                $("#productList").slick("unslick"); 
            }
            $("#productList").slick({ 
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true,
                autoplay: true,
                autoplaySpeed: 2000,
                dots: false
            });

            bindCartButtons();
        });
    }


    function bindCartButtons() {
        console.log("Event listeners are being re-bound."); 
        $(document).off("click", ".addToCart").on("click", ".addToCart", function() {
            console.log("Add to Cart button clicked!"); 

            let productCard = $(this).closest(".product-card").clone();
            productCard.find(".addToCart, .showDetails").remove();
            productCard.append('<button class="removeFromCart">Remove</button>');

            if ($("#cartItems").children().length === 0) {
                $("#cartItems").html("");
            }

            $("#cartItems").append(productCard);
            bindRemoveButtons(); 
        });

        $(document).off("click", ".showDetails").on("click", ".showDetails", function() {
            console.log("Show Details button clicked!"); 

            $("#modalTitle").text($(this).data("title"));
            $("#modalImage").attr("src", $(this).data("image"));
            $("#modalPrice").text("Price: " + $(this).data("price") + "$");
            $("#modalDescription").text($(this).data("description"));

            $.fancybox.open({
                src: "#productModal",
                type: "inline"
            });
        });
    }

    function bindRemoveButtons() {
        $(document).off("click", ".removeFromCart").on("click", ".removeFromCart", function() {
            $(this).closest(".product-card").remove();

            if ($("#cartItems").children().length === 0) {
                $("#cartItems").html("<p>Your cart is empty.</p>");
            }
        });
    }

    $("#searchBox").on("input", function() {
        let searchText = $(this).val().toLowerCase();
        $(".product-card").each(function() {
            let productTitle = $(this).data("title");
            if (productTitle.includes(searchText)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });


    $("#clearCart").click(function() {
        $("#cartItems").empty().html("<p>Your cart is empty.</p>");
    });

    loadProducts(); 
});
