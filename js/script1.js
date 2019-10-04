
// global variables for the project
const studentList = document.querySelectorAll(".student-item");
const nbrItems = 10;
const page = document.querySelector('.page');

//function to create elements
const createElement = (elementName, prop, value) => {
    const element = document.createElement(elementName);
    element[prop] = value;
    return element;
};

//Function to determine how many students we want per page
const showPage = (list, page) => {
    const startIndex = (page * nbrItems) - nbrItems;
    const endIndex = page * nbrItems;

    for(let i = 0; i < list.length; i++){
        if(i >= startIndex && i < endIndex){
            list[i].style.display = '';
        }else {
            list[i].style.display = 'none';
        }
    }
};


//function creating pages buttons dynamically
const appendPageLinks = (list) => {
    const totalPages = Math.ceil(list.length / nbrItems);
    const pageDiv = createElement('div', 'className', 'pagination');
    const pageUl = createElement('ul');

    const pagination = document.querySelector(".pagination");
    if(pagination){
        pagination.parentNode.removeChild(pagination);
    }

    //loop to create dynamically our pages links
    for(let i = 0; i < totalPages; i++){
        let pageNumber = i + 1;
        const pageLi = createElement('li');
        const pageLink = createElement('a', 'textContent', pageNumber);

        if(pageNumber === 1){
            pageLink.className = 'active';
        }

        //event listener to go in the other pages and active the right links when clicked
        pageLink.addEventListener('click', (e)=> {
            const clickedLink = e.target;
            const nbrPage = parseInt(clickedLink.textContent);
            const activeLink = document.querySelector('.active');

            activeLink.className = '';
            clickedLink.className = 'active';

            showPage(list,nbrPage);
        });
        
        pageLi.appendChild(pageLink);
        pageUl.appendChild(pageLi);
    }
    pageDiv.appendChild(pageUl);
    page.appendChild(pageDiv);
};

//function to add the search input and the event Listener 
const searchForm = (list) => {
    const header = document.querySelector(".page-header");
    const searchDiv = createElement('div', 'className', 'student-search');
    const searchInput = createElement('input', 'type', 'text');
    searchInput.placeholder = "Search for students...";
    const searchButton = createElement('button', 'textContent', 'search');

    const input = document.querySelector(".student-search");
    if(input){
        input.parentNode.removeChild(input);
    }

    searchDiv.appendChild(searchInput);
    searchDiv.appendChild(searchButton);
    header.appendChild(searchDiv);

    searchButton.addEventListener('click', (e) =>{
        e.preventDefault();
        search(searchInput, list);
    });

    searchInput.addEventListener("keyup", (e) =>{
        const error = document.querySelector(".error");

        //backspace key used
        if(e.keyCode === 8 && error){
            page.removeChild(error);
            search(searchInput, list);
        
        //enter key used
        }else if(e.keyCode === 27){
            page.removeChild(error);
            loadingPage(list);
            searchForm(list);
        }else{
            search(searchInput, list);
        }
        e.preventDefault();
    });
};

//function to initiate the page
const loadingPage = (list) => {
    showPage(list, 1);
    appendPageLinks(list);
}

//function to setup the name search
const search = (search, student) => {
    const userInput = search.value.toLowerCase();
    const noResult = createElement("span", "className", "error");
    const error = document.querySelector(".error");
    let results = [];

    //we loop through the list to see if the user input is found in the list
    for(let i = 0; i < student.length; i++){
        student[i].style.display = "none";
        const name = student[i].textContent.toLowerCase();

        if(userInput !== 0 && name.includes(userInput)){
            results.push(student[i]);
        }
    }

    //if there's nothing in the result's array or if we don't have any correspondence with the list we have a div error that is created.
    if(results.length === 0 && userInput.length !== 0){
        if(error){
            page.removeChild(error);
        }
        noResult.textContent = "No result found";
        page.appendChild(noResult);
        appendPageLinks(noResult);
    }else {
        loadingPage(results);
    }

    //if we have nothing in the search input we reload the pages and erase the error div.
    if(userInput.length === 0){
        page.removeChild(error);
        loadingPage(student);
    }
}

loadingPage(studentList);
searchForm(studentList);
