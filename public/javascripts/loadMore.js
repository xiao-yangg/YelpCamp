var currentIndex = 10; // first 10 already shown

function loadmore()
{
    var maxResult = 10;

    for (var i=0; i< maxResult; i++)
	{
		$("<div>", {id: `${currentIndex + i}`}).appendTo('#content');

		if (`${campgrounds.features[currentIndex + i].images.length}`) 
		{
			$("<div>", {class: "card mb-3"}).append
			(
				$("<div>", {class: "row"}).append
				( 
					$("<div>", {class: "col-md-4"}).append
					(
						$("<img>", {src: `${campgrounds.features[currentIndex + i].images[0].url}`, class:"img-fluid"})
					),
					$("<div>", {class: "col-md-8"}).append
					(
						$("<div>", {class: "card-body"}).append
						( 
							$("<h5>", {class: "card-title"}).text(`${campgrounds.features[currentIndex + i].title}`),
							$("<p>", {class: "card-text"}).text(`${campgrounds.features[currentIndex + i].description}`),
							$("<p>", {class: "card-text"}).append
							(
								$("<small>", {class: "text-muted"}).text(`${campgrounds.features[currentIndex + i].location}`)
							),
							$("<a>", {class: "btn btn-secondary", href: `/campgrounds/${campgrounds.features[currentIndex + i]._id}`}).text(`View ${campgrounds.features[currentIndex + i].title}`)
						)
					)
				)
			).appendTo(`#${currentIndex + i}`)
		}
		else 
		{
			$("<div>", {class: "card mb-3"}).append
			(
				$("<div>", {class: "row"}).append
				( 
					$("<div>", {class: "col-md-4"}).append
					(
						$("<img>", {src: "https://res.cloudinary.com/dzcwwadep/image/upload/v1623490280/YelpCamp/ch1lzzz3ukhtukmsbi3l.png", class:"img-fluid"})
					),
					$("<div>", {class: "col-md-8"}).append
					(
						$("<div>", {class: "card-body"}).append
						( 
							$("<h5>", {class: "card-title"}).text(`${campgrounds.features[currentIndex + i].title}`),
							$("<p>", {class: "card-text"}).text(`${campgrounds.features[currentIndex + i].description}`),
							$("<p>", {class: "card-text"}).append
							(
								$("<small>", {class: "text-muted"}).text(`${campgrounds.features[currentIndex + i].location}`)
							),
							$("<a>", {class: "btn btn-secondary", href: `/campgrounds/${campgrounds.features[currentIndex + i]._id}`}).text(`View ${campgrounds.features[currentIndex + i].title}`)
						)
					)
				)
			).appendTo(`#${currentIndex + i}`)
		}	
		if (currentIndex >= campgrounds.features.length)
		{
			$("#load").hide();
			return;
		}
	}
	currentIndex += maxResult;
	return;
};

// ===== FROM THIS ======
// <% for (let campground of campgrounds) {%>
// 	<div class="card mb-3">
// 		<div class="row">
// 		<div class="col-md-4">
// 			<% if (campground.images.length) {%> 
// 			<img src="<%= campground.images[0].url %>" alt="" class="img-fluid">
// 			<% } else{%> <%# if got no image submitted %> 
// 			<img src="https://res.cloudinary.com/dzcwwadep/image/upload/v1623490280/YelpCamp/ch1lzzz3ukhtukmsbi3l.png" alt="" class="img-fluid">                    
// 			<% } %> 
// 		</div>
// 		<div class="col-md-8">
// 			<div class="card-body">
// 				<h5 class="card-title"><%= campground.title %></h5>
// 				<p class="card-text"><%= campground.description %></p>
// 				<p class="card-text">
// 					<small class="text-muted"><%= campground.location %></small>
// 				</p>
// 			<a class="btn btn-secondary" href="/campgrounds/<%= campground._id %>">View <%= campground.title %></a>
// 			</div>
// 		</div>
// 	</div>
// 	</div>
// 	<% } %> 