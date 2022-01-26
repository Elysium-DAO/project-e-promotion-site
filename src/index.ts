import './stylesheet/main.scss';
import ProjectE from './ProjectE/ProjectE';

window.onload = () => {
    fetch('./Dataset/site_config.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        let projectEDemo = new ProjectE(myJson);
    });
};