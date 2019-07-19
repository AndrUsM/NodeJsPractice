if(window.document.body.scrollHeight > window.screen.availHeight){
    document.querySelector('footer').style.position = 'relative'
}
else{
    document.querySelector('footer').style.position = 'fixed'
    document.querySelector('footer').style.left = 0
    document.querySelector('footer').style.bottom = 0
}
