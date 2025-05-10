
let mybutton = document.getElementById("myBtn");

window.onscroll = function() {scrollFunction()};

var cartCounter = 0;
var cartTotalPrice = 0;
var cartTable = {
    itemDetails: []
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
	function topFunction() {
	  document.body.scrollTop = 0;
	  document.documentElement.scrollTop = 0;
	}


	function loadXMLData() {
           let xmlhttp = new XMLHttpRequest();
           xmlhttp.onreadystatechange = function () {
               if (this.readyState == 4 && this.status == 200) {
                   plotProductDetails(this);
				   updateCartNo();
               }
           };
           xmlhttp.open("GET", "home/xml/product_xml.xml", true);
           xmlhttp.send();
       }

	   
       function plotProductDetails(xmlVar) {
		let featureProduct="";
		let penProduct="";
		let notebooksProduct="";
		let paperpadProducts="";
		let generalsuppliesProduct="";
		let artcraftProduct="";
		
		 parser = new DOMParser();
		  let xmlDoc = parser.parseFromString(xmlVar.response,"text/xml"); 
           
           let productData = xmlDoc.getElementsByTagName("product");

           for (var i = 0; i < productData.length; i++) {
			
				 let pd = {pn: productData[i].getElementsByTagName("name")[0].childNodes[0].nodeValue,pp:productData[i].getElementsByTagName("price")[0].childNodes[0].nodeValue};
				 let pdString = JSON.stringify(pd);	
				 let productCategory = productData[i].children[3].textContent;
				 let dataString ="";
				 dataString +=  '<div class="col-lg-3 col-md-4 col-sm-6">';
				 dataString +=  '<div class="featured__item">';
				 dataString +=  '<div class="featured__item__pic set-bg" data-setbg='+productData[i].getElementsByTagName("itemimage")[0].childNodes[0].nodeValue+' style="background-image: url('+productData[i].getElementsByTagName("itemimage")[0].childNodes[0].nodeValue+');">';
				 dataString +=  '<ul class="featured__item__pic__hover">'; 
				 dataString +=  "<li><a class='ci'  data-pp=\'"+pdString+"\'>";
				 dataString +=  '<i class="fa fa-shopping-cart"></i></a></li>';
				 dataString +=  '</ul>';
				 dataString +=  '</div>';
				 dataString +=  '<div class="featured__item__text">';
				 dataString +=  '<h6><a href="#">'+productData[i].getElementsByTagName("name")[0].childNodes[0].nodeValue+'</a></h6>';
				 dataString +=  '<h5><i class="fa fa-rupee" style="font-size: medium;"></i> '+ productData[i].getElementsByTagName("price")[0].childNodes[0].nodeValue+'</h5>';
				 dataString +=  '</div>';
				 dataString +=  '</div>';
				 dataString +=  '</div>';
				
				 if(productCategory == "FP")
					featureProduct +=dataString;
				 
				 if(productCategory == "Pen")
					penProduct +=dataString;

				 if(productCategory == "Note Books")
					notebooksProduct +=dataString;
							
				 if(productCategory == "Paper and Pad")
					paperpadProducts +=dataString;
								
				 if(productCategory == "General Supplies")
					generalsuppliesProduct +=dataString;
									
				 if(productCategory == "Art and Craft")
					artcraftProduct +=dataString;
				}
										   
           document.getElementById("featureProduct").innerHTML = featureProduct;
		   document.getElementById("penProduct").innerHTML = penProduct;
		   document.getElementById("notebooksProduct").innerHTML = notebooksProduct;
		   document.getElementById("paperpadProducts").innerHTML = paperpadProducts;
		   document.getElementById("generalsuppliesProduct").innerHTML = generalsuppliesProduct;
		   document.getElementById("artcraftProduct").innerHTML = artcraftProduct;
		   
		   $.getScript("home/js/main.js?v=1");
       }

	   $(document).ready(function () {
	             $(".featured__item__pic__hover a").click(function (event) {
	                 event.preventDefault();
	             });
				 
				 // Initialize the dialog but keep it closed
				          $("#dialog").dialog({
				              autoOpen: false
				          });

				          // Open the dialog on button click
				          $("#cartBox").click(function () {
				              $("#dialog").dialog("open");
				          });
						  
						  
	         });
		
			$(document).on("click", ".ci", function() {
			var pObject =  $(this).data('pp');
			console.log("product json "+pObject);
			cartCounter++;
			pName = pObject["pn"];
			cartTotalPrice = parseInt(cartTotalPrice)+parseInt(pObject["pp"]);
			
			/*cartTable.itemDetails.push({ 
			       "pName" : pName,
			       "cartTotalPrice"  : cartTotalPrice,
			       "pCount"       : item.age 
			   });
			   */
			updateCartNo();
			 });
			 
					 
			 function updateCartNo(){
				$("#cartItem").html(cartCounter);
				$("#cartPrice").html("Rs "+cartTotalPrice);
			 }
			 
	/*	 function viewCart(cartData){
				
				//const 
													<tr>
												   <td>Item Name</td>
												   <td>Item Quantity</td>
												   <td>Item Total Price</td>
												   </tr>
			 }*/
	 
	   loadXMLData();
	   
	   
	   