import React, {useEffect, useState} from 'react'
import mapMarkerImg from '../images/Local.svg'
import {Link} from 'react-router-dom'
import {FiPlus,FiArrowRight} from 'react-icons/fi'
import "../styles/pages/orphanagesMap.css"
import api from '../services/api'

import {Map, TileLayer, Marker, Popup} from 'react-leaflet'


import happyMapIcon from '../utils/mapIcon'

interface IOrphanage{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    // about: string;
    // open_on_weekends: boolean,
    // opening_hours: string
}

function OrphanagesMap(){
    const [orphanages, setOrphanage] = useState<IOrphanage[]>([])
    useEffect(()=>{
        api.get('orphanages').then(response=>{
            setOrphanage(response.data)
        })
    },[])
    return (
        <div id="page-map">
            <aside>
                <header>
                    <img src={mapMarkerImg} alt="Happy"/>
                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita :)</p>
                </header>
                <footer>
                    <strong>Rio de Janeiro</strong>
                    <span>São Gonçalo</span>
                </footer>
            </aside>
            <Map 
                center={[-22.7935972,-43.0292044]}
                zoom={15}
                style={{ width:'100%', height: '100%'}}

            >
                {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"/> */}
                <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} />
            
           {orphanages.map(orphanage=>(
                <Marker key={orphanage.id}
                position ={[orphanage.latitude,orphanage.longitude]}
                icon={happyMapIcon}
            >
                <Popup
                    closeButton={false} 
                    minWidth={240} 
                    className="map-popup"
                >
                    {orphanage.name}
                    <Link to={`orphanages/${orphanage.id}`}>
                        <FiArrowRight size={20} color="#fff" />
                    </Link>
                </Popup>
            </Marker>
           ))}

           
            </Map>
                <Link to="/orphanages/create" className="create-orphanage">
                    <FiPlus size={32} color="#fff"/>
                </Link>
           
        </div>    
        )
}

export default OrphanagesMap