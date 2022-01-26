import REGL, {Regl} from 'regl';
import {GLSLDataSet} from './WebglType';
import {Dictionary} from 'typescript-collections';
import {GetImagePromise} from '../UtilityMethod';
import {PlaneVertex} from '../UniversalType';

class WebglUtility {

    textureCache : Dictionary<string, HTMLImageElement>;

    constructor() {
        this.textureCache = new Dictionary();
    }

    async PrepareREGLShader(vertFilePath: string, fragFilePath: string) {
        let VertPros = fetch(vertFilePath, {method: 'GET', credentials: 'include'});
        let FragPros = fetch(fragFilePath, {method: 'GET', credentials: 'include'});
    
        return Promise.all([VertPros, FragPros ])
        .then( responses =>
            Promise.all(
                [responses[0].text(), responses[1].text()]
            )
        ).then((values) => {
            let gLSLDataSet : GLSLDataSet = {
                vertex_shader : values[0],
                fragment_shader : values[1],
            };

            return gLSLDataSet; 
        });
    }

    GetPlaneVertex() : PlaneVertex {
        return {
            a_position : [[-1, -1], [-1, 1], [1, -1], [1, -1], [-1, 1], [1, 1]],
            a_uv : [[0, 0], [0, 1], [1, 0], [1, 0], [0, 1], [1, 1]],
            count : 6
        }
    }

    ApplyAspectRatioToPlane(planeVertex: PlaneVertex, aspectRatio : number) : PlaneVertex {

        for (let i = 0; i < planeVertex.count; i++) {
            planeVertex.a_position[i][0] = planeVertex.a_position[i][0] * aspectRatio;
        }

        return planeVertex;
    }


    async GetImage(path : string) : Promise<HTMLImageElement> {

        if (this.textureCache.containsKey(path)) {
            return this.textureCache.getValue(path);
        }

        let texture = await GetImagePromise(path);
        this.textureCache.setValue(path, texture);

        return texture;         
    }

    
}

export default WebglUtility;