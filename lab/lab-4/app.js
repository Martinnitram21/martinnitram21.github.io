var textBox = document.getElementById("txtBox");
var btnAdd = document.getElementById("btnAddItem");
var btnHighlight = document.getElementById("highlightAll");
var btnRemove = document.getElementById("removeAll");
var list = document.getElementById("list");

btnAdd.addEventListener('click', function () {
	var value = textBox.value.trim();
	if (value === '') return;
	if (list.children.length === 1 && list.children[0].textContent.trim() === '') {
		list.removeChild(list.children[0]);
	}

	var li = document.createElement('li');
	li.textContent = value;
	list.appendChild(li);

	textBox.value = '';
	textBox.focus();
});

btnHighlight.addEventListener('click', function () {
	var items = list.querySelectorAll('li');
	items.forEach(function (item) {
		item.classList.toggle('highlight');
	});
});

btnRemove.addEventListener('click', function () {
	while (list.firstChild) {
		list.removeChild(list.firstChild);
	}
});
