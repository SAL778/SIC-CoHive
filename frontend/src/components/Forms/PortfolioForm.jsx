import React, { useState, useEffect, useContext } from "react";
import { UserContext, HostContext } from "../../App.jsx";
import { useForm } from "@mantine/form";
import { TextInput } from "@mantine/core";
import './form.css';

export default PortfolioForm

/**
 * A component function that returns the render of the booking form, and handles values changes.
 * @param {Object|null} portfolioItem - A portfolio Item, if one exists.
 * @param {Array[Object]} availableIcons - A list of icons available to be used.

 */
function PortfolioForm(portfolioItem) {
    const defaultIcon = "fa fa-lightbulb"
    const [availableIcons, setAvailableIcons] = useState([]) //To be retrieved from the backend eventually

    const matchesHttpPattern = (string) = (/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/).test(string)
    const matchesWwwPattern = (string) = (/^www\.\w+(\.\w+)+$/).test(string)
    const matchesDomainPattern = (string) = (/^(\w+\.)+\w+$/).test(string)

    useEffect(() => {
        setAvailableIcons(getIcons())
    }, [])

    const form = useForm({
        initialValues: {
            title: portfolioItem?.title ?? "",
            description: portfolioItem.description ?? "",
            link: portfolioItem?.link ?? "",
            icon: portfolioItem?.icon ?? defaultIcon,       //The name of the icon className
        },
        validate: {
            title: (value) => {
                (value.length < 15 || value.length < 1) 
                    ? 'Title must be between 1 and 15 characters'
                    : null
            },
            description: (value) => {
                (value.length < 50 || value.length < 1)
                    ? 'Title must be between 1 and 50 characters'
                    : null
            },
            link: (value) => {
                !(matchesHttpPattern(value) || matchesWwwPattern(value) || matchesDomainPattern(value))
                    ? 'The link must be a valid url'
                    : null
            }
      },
      transformValues: (values) => {
        //Transfrom links to match the expected src for an <a> tag
        const normalized = values
        if (matchesDomainPattern(values.link)) {
            normalized.link = 'www.' + values.link
        }
            
        if (matchesWwwPattern(values.link)) {
            normalized.link = 'https://' + values.link
        }
        return normalized
      }
    })

    return (
        <form onSubmit = {form.onSubmit((values) => {onSubmit(values)})}>
            {/* TODO: Implement this */}
            <IconPicker
                availableIcons = {availableIcons}     //Extends the Input base class
                {...form.getInputProps('icon')}
            />
            <TextInput
                label="Title"
                placeholder="Enter a title"
                {...form.getInputProps('title')}     //Binds the event listener and values
            />
            <TextInput
                label="Description"
                placeholder="Enter a brief description"
                {...form.getInputProps('description')}
            />
            <TextInput
                label="Description"
                placeholder="Enter a link (https://www...)"
                {...form.getInputProps('link')}
            />
        </form>
    )
}

const getIcons = () => {
    //TODO: Get icons from backend
    return (
        [   
            //General
            'fa fa-lightbulb',
            'fa fa-link',
            'fa fa-camera',
            'fa fa-music',
            'fa fa-palette',
            'fa fa-code',
            'fa fa-flask',
            'fa fa-clapperboard',
            'fa fa-podcast',

            //Brands
            'fa-brands fa-google-drive',
            'fa-brands fa-github',
            'fa-brands fa-youtube',
            'fa-brands fa-discord',
            'fa-brands fa-linkedin',
            'fa-brands fa-dribble',
            'fa-brands fa-figma',
            'fa-brands fa-codepen',
            'fa-brands fa-instagram',
            'fa-brands fa-pinterest',
            'fa-brands fa-soundcloud',
        ]

    )
}