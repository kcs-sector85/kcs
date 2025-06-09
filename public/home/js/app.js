let products = [];
let categories = [];
var cart = [];

//let mybutton = document.getElementById("myBtn");

window.onscroll = function() {scrollFunction()};
$(document).ready(function () {
    // Load products from XML
    $.ajax({
        type: "GET",
        url: "home/xml/products.xml",
        dataType: "xml",
        success: function (xml) {
            $(xml).find("product").each(function () {
                let product = {
                    id: $(this).find("id").text(),
                    name: $(this).find("name").text(),
                    category: $(this).find("category").text(),
                    price: parseFloat($(this).find("price").text()),
		    pages: parseFloat($(this).find("price").text()),
                    image: $(this).find("image").text()
                };
                products.push(product);
                if (!categories.includes(product.category)) {
                    categories.push(product.category);
                }
            });
            renderCategories();
            renderProducts();
        },
        error: function () {
            alert("Unable to load products.xml. Please ensure it exists and is accessible.");
        }
    });

    // Search functionality
    $("#searchInput").on("input", function () {
        let val = $(this).val().toLowerCase();
        renderProducts(val);
    });

    // Contact form submit
    $("#gform").on("submit", function (e) {
        e.preventDefault();
        $("#contactMsg").text("Thank you for your order. Will connect with you shortly !! To place new order please reload the page.");
        $(this).trigger("reset");
		$("#cartList").html("");
		$("#cartTotal").text(0.0);
		sessionStorage.clear();
    });
	cart = JSON.parse(sessionStorage.getItem("cartdata"));
	if(cart != null && cart.length>0)
	renderCart();
	else
	cart = [];
	//$("#cartList").html(sessionStorage.getItem('cartdata'));
	//$("#cartTotal").html(parseInt(sessionStorage.getItem('carttotal'))>0 ? sessionStorage.getItem('carttotal') : 0.0);
});

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("myBtn").style.display = "block";
  } else {
    document.getElementById("myBtn").style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
	function topFunction() {
	  document.body.scrollTop = 0;
	  document.documentElement.scrollTop = 0;
	}

// Render category list
function renderCategories() {
    let ul = $("#categoryList");
    ul.empty();
    ul.append(`<li class="selected" data-category="All">All Products</li>`);
    categories.forEach(cat => {
        ul.append(`<li data-category="${cat}">${cat}</li>`);
    });

    // Category click
    $("#categoryList li").click(function () {
        $("#categoryList li").removeClass("selected");
        $(this).addClass("selected");
        renderProducts($("#searchInput").val());
    });
}

// Render products
function renderProducts(searchTerm = "") {
    let currentCategory = $("#categoryList li.selected").data("category") || "All";
    let grid = $("#productGrid");
    grid.empty();

    let filtered = products.filter(p => {
        let matchesCategory = (currentCategory === "All") || (p.category === currentCategory);
        let matchesSearch = p.name.toLowerCase().includes((searchTerm || "").toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.html("<div style='color:#b73d2a;font-size:1.1rem'>No products found.</div>");
        return;
    }

    filtered.forEach(p => {
        let card = $(`
            <div class="product-card">
                <img class="product-thumb" src="${p.image}" alt="${p.name}">
                <div class="product-name">${p.name}</div>
                <div class="product-price">₹${p.price.toFixed(2)}</div>
                <button data-id="${p.id}">Add to Cart</button>
            </div>
        `);
        card.find("button").click(function () {
            addToCart(p.id);
        });
        grid.append(card);
    });
}

// Add to cart
function addToCart(id) {
    let prod = products.find(p => p.id == id);
    if (!prod) return;
    let existing = cart.find(item => item.id == id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...prod, qty: 1 });
    }
	sessionStorage.setItem("cartdata",JSON.stringify(cart));
    renderCart();
}

// Render cart
function renderCart() {
    let ul = $("#cartList");
    ul.empty();
    let total = 0.0;
    cart.forEach(item => {
        total += item.qty * item.price;
        let li = $(`
            <li>
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-qty">x${item.qty}</span>
                <span>₹${(item.qty * item.price).toFixed(2)}</span>
                <button class="cart-item-remove" data-id="${item.id}">×</button>
            </li>
        `);
        li.find(".cart-item-remove").click(function () {
            removeFromCart(item.id);
        });
        ul.append(li);
    });
    $("#cartTotal").text(total.toFixed(2));
	if(cart.length>0)
	$("#message").val($(".cart-section").html());
	else
	$("#message").val("");
}

// Remove from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id != id);
	sessionStorage.setItem("cartdata",JSON.stringify(cart));
    renderCart();
}
