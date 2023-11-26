import React from 'react'
import {
  HStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  Text,
  Select,
  InputGroup,
  InputLeftElement,
  InputRightElement, 
  Box,
  ResponsiveValue,
  Textarea,
  Checkbox,
  RadioGroup,
  Stack,
  Radio,
  Flex,
  VStack
} from '@chakra-ui/react';
import { nullOrEmpty } from "../../../utils/f"
//import 'react-phone-number-input/style.css'
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input'
import { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash, FaInfoCircle, FaMinus, FaPlus } from 'react-icons/fa'
import InfoLabel from '../InfoLabel'
//import LocationPicker from '../LocationPicker';
import { arraysEqual } from './utils';
//import SelectTree, { SelectTreeEvent, SelectTreeOptionWithChildren } from './inputs/SelectTree';

const countryCodes = require('country-codes-list')

interface TYPES_PROPS {
text: string,
email: string,
number: string,
range: string,
date: string,
phone: string,
password: string,
select: string,
select_tree: string,
textarea: string,
checkbox: string,
checklist: string,
radio: string,
none: string,
location: string,
price: string
}

const TYPES = {
text: "text",
email: "email",
number: "number",
range: "range",
date: "date",
phone: "phone",
password: "password",
select: "select",
select_tree: "select_tree",
textarea: "textarea",
checkbox: "checkbox",
checklist: "checklist",
radio: "radio",
none: "none",
location: "location",
price: "price"
}
export interface PhoneValue {
number: string,
countryCode?: string,
currencyCode?: string,
dialingCode?: string
}
export interface LocationValue {
name?: string,
address?: string,
position?: {
    lat: number,
    lng: number
}
}
export interface RangeValue {
min: number,
max: number
}
interface InputBoxProps {
title?: string | any[], 
name?: string, type?: string, locale?: string, 
value?: string | any[] | number | RangeValue | PhoneValue | LocationValue | boolean | any, 
onFocus?: (value: any) => void,
onChange?: (value: any) => void, 
onCheckInfo?: (value: any) => {
  //the number of millisecond the input must wait to be sure is the user is no more typing before
  // calling the search method
  waitTime: number,
  //the search method
  checker: (currentValue: any) => Promise<boolean>
}, 
onKeyDown?: (e?: any) =>void,
errorMessage?: string | any[], 
helperText?: string | any[] | any | undefined, 
info?: string | any[], 
placeholder?: string | any[] | undefined, 
textTransform?: ResponsiveValue<any>, 
options?: any[], 
onOptionValue?: (option: any, index?: number) => string | number | any[], 
onOptionName?: (option: any, index?: number) => string | any[] | JSX.Element, 
defaultCountry?: string, phoneSelectBg?: string, phoneSelectColor?: string,
numberDecimals?: number,
hasNegOverflow?: boolean,
numberUnit?: any,

iconLeft?: any, iconRight?: any,

//Date
disableCalendar?: boolean, disableClock?: boolean, dateFormat?: string,

//Radio
direction?: ResponsiveValue<any>,

maxTextLimit?: number,
resize?: ResponsiveValue<any>,

/**Range props */
rangeMinPlaceholder?: string,
rangeMaxPlaceholder?: string,
minTitle?: string | any[],
maxTitle?: string | any[],
disabled?: boolean,
apiKey?: string, mapToSearchRatio?: number, twoDigitCountryCode?: string, inputRef?: any, 
defaultLatlng?: {lat: number, lng: number} | undefined, geotype?: string,
[x:string]: any
}

const InputBox: React.FC<InputBoxProps> & { TYPES: TYPES_PROPS } = ({
title, name, type, locale, value, onChange, onFocus, onCheckInfo, onKeyDown,
errorMessage, helperText, info, 
placeholder, textTransform, options, onOptionValue, onOptionName, 
defaultCountry, phoneSelectBg, phoneSelectColor, 
numberDecimals = 2, hasNegOverflow, numberUnit, 
rangeMinPlaceholder, minTitle,
rangeMaxPlaceholder, maxTitle,
disabled, maxTextLimit, direction, resize, 
disableCalendar, disableClock, dateFormat,
iconLeft, iconRight, 
apiKey, mapToSearchRatio, twoDigitCountryCode, inputRef, 
defaultLatlng, geotype, 
...props
}) => {

const [showPassword, setShowPassword] = useState<boolean>()

const [decimalsSet, setDecimalsSet] = useState<string[]>([])
useEffect(() => {
  if(type == TYPES.number && value && title && !decimalsSet.includes(title as string)) {
    setDecimalsSet([...decimalsSet, title as string])
    const v = isNaN(value)? value : (parseFloat(`${value || 0}`))
              .toLocaleString(locale, {
                minimumFractionDigits: numberDecimals, 
                maximumFractionDigits: numberDecimals
              })
    if(!disabled && onChange) {
      onChange(v)
    }
  }
}, [value, name])

const changeNumber = (e: any) => {
  const value = e.target.value
  const v = isNaN(value)? value : (parseFloat(`${value || 0}`))
              .toLocaleString(locale, {
                minimumFractionDigits: numberDecimals, 
                maximumFractionDigits: numberDecimals
              })
  
  if(!disabled && onChange) {
    onChange(v)
  }
}

const increaseNumber = () => {
  const numberSteps = (1 / Math.pow(10, numberDecimals || 0))
  const v = isNaN(value)? value : (parseFloat(`${value || 0}`) + numberSteps)
            .toLocaleString(locale, {
              minimumFractionDigits: numberDecimals, 
              maximumFractionDigits: numberDecimals
            })
  if(!disabled && onChange) {
    onChange(v)
  }

}
const decreaseNumber = () => {
  const numberSteps = (1 / Math.pow(10, numberDecimals || 0))
  var result = isNaN(value)? 0 : parseFloat(`${value || 0}`) - numberSteps
  if(result < 0 && !hasNegOverflow) result = 0
  const v = isNaN(value)? value : result
            .toLocaleString(locale, {
              minimumFractionDigits: numberDecimals, 
              maximumFractionDigits: numberDecimals
            })
  if(!disabled && onChange) onChange(v)
}

const updateRangeValue = (min: any, max: any) => {
  if(!isNaN(min)) {
    var result = parseFloat(`${min}`)
    if(result < 0 && !hasNegOverflow) result = 0
    const v = {min: result, max: (value as RangeValue)?.max || 0}
    if(!disabled && onChange) onChange(v)

  } else if(!isNaN(max)) {
    var result = parseFloat(`${max}`)
    if(result < 0 && !hasNegOverflow) result = 0
    const v = {min: (value as RangeValue)?.min || 0, max: result}
    if(!disabled && onChange) onChange(v)
  }
}


const [countryCodesMap, setCountryCodesMap] = useState<{[x: string]: string}>({})
useEffect(() => {
  if(type == TYPES.phone) {
    const countruesToCurrency = countryCodes.customList('countryCode', '{currencyCode}')
    setCountryCodesMap(countruesToCurrency)
  }

}, [type])

const [checklist, setChecklist] = useState<any[]>([])
useEffect(() => {
  if(Array.isArray(options) && checklist.length == 0) {/*
    if(value) {

    }*/
    setChecklist(options)
  }
}, [options, value])

const [searchActive, setSearchActive] = useState<boolean>(false)
const handleInputCheck = (
  getLatestValue: () => any, 
  onValueIsLatest: (checkedValue: any) => boolean,
  checker: (valueToCkeck: any) => Promise<boolean>, waitTime?: number
) => {
  if(checker) {
    if(!searchActive) {
      setSearchActive(true)
      setTimeout(() => {
        const check = () => {
          const checkedValue = getLatestValue()
          checker(checkedValue)
          .then(() => {
            //If the input has changed after the check was done, check the new input
            if(!onValueIsLatest(checkedValue)) {
              check()

            } else {
              setSearchActive(false)
            }
          })
          .catch(e => {
            setSearchActive(false)
          })
        }
        check()
        
      }, waitTime || 0)
    }
  }
}

return (
  <FormControl isInvalid={!nullOrEmpty(errorMessage) && type != TYPES.location} 
    opacity={disabled? "0.3" : "1"}
    {...props}>
    {
      !title || type == TYPES.checkbox? null :
      nullOrEmpty(info)?
      <FormLabel textTransform={textTransform || "capitalize"}>{title}</FormLabel>
      :
      <InfoLabel as={FormLabel} 
          info={info} textTransform={textTransform || "capitalize"}>
          {title}
      </InfoLabel>
    }
    {
      type == TYPES.date?
      null
      :
      type == TYPES.select?
      <InputGroup>
        {iconLeft? <InputLeftElement children={iconLeft} /> : null}
        <Select onFocus={onFocus} disabled={disabled} ref={inputRef} name={name} value={value as string | number | string[]} 
        placeholder={placeholder as string || ""} onChange={e => {
          if(!disabled && onChange) onChange(e.target.value)
        }} 
        errorBorderColor='red.300' isInvalid={!nullOrEmpty(errorMessage)}>
          {
            (options || []).map((v, i) => {
              if(onOptionValue && onOptionName) {
                return (
                  <option key={i} value={onOptionValue(v, i)}>{onOptionName(v, i)}</option>
                )

              } else { return null}
            })
          }
        </Select>
        {iconRight? <InputRightElement children={iconRight} /> : null}
      </InputGroup>
      :
      type == TYPES.phone?
      <InputGroup>
        {iconLeft? <InputLeftElement children={iconLeft} /> : null}
        <Input onFocus={onFocus} disabled={disabled} ref={inputRef} as={PhoneInput} defaultCountry={defaultCountry || "US"} 
        background="transparent !important" 
        _focusVisible={{
          outline: "none !important",
          border: "none !important"
        }}
        placeholder={placeholder as string || ""}
        value={(value as PhoneValue)?.number}
        onKeyDown={onKeyDown}
        onChange={v => { 
          const getNumberInfo = () => {
            const codes = parsePhoneNumber(`${v}`)
            return {
              number: `${v}`,
              countryCode: codes?.country,
              currencyCode: codes?.country? countryCodesMap[codes?.country || ""] : null,
              dialingCode: codes?.countryCallingCode,
            }
          }
          const inflatedValue = getNumberInfo()
          if(!disabled && onChange) {
            onChange(inflatedValue)
          }
          if(!disabled && onCheckInfo) {
            const { checker, waitTime } = onCheckInfo(getNumberInfo())
            //only check input in "onChange" if waitTime is greater than zero.
            // This is good in searching a text results as a user types in a search bar, 
            // or saving an article on a server as the user types
            if(waitTime > 0) {
              handleInputCheck(getNumberInfo, (checkedValue) => {
                return checkedValue.number === v.target.value
              }, checker, waitTime)
            }
          }
        }}
        onBlur={v => {
          const getNumberInfo = () => {
            const codes = parsePhoneNumber(`${v}`)
            return {
              number: `${v}`,
              countryCode: codes?.country,
              currencyCode: codes?.country? countryCodesMap[codes?.country || ""] : null,
              dialingCode: codes?.countryCallingCode,
            }
          }
          if(!disabled && onCheckInfo) {
            const { checker, waitTime } = onCheckInfo(v.target.value)
            //only check input in "onBlur" if waitTime is not set or equal to zero.
            // This is good in validating an input as it looses focus when the user moves to another,
            // input field
            if(!waitTime) {
              handleInputCheck(getNumberInfo, (checkedValue) => {
                return checkedValue.number === v.target.value
              }, checker, waitTime)
            }
          }
        }} />
        <style>
          {`
            .PhoneInputCountrySelect {
              background: ${phoneSelectBg || "#000"} !important;
              color: ${phoneSelectColor || "#fff"}
            }
            .PhoneInputInput {
              background: transparent !important;
              border-radius: 3px !important;
            }`
          }
        </style>
        {iconRight? <InputRightElement children={iconRight} /> : null}
      </InputGroup>
      :
      type == TYPES.password?
      <InputGroup>
        {iconLeft? <InputLeftElement cursor="pointer" children={iconLeft} /> : null}
        <Input onFocus={onFocus} disabled={disabled} ref={inputRef} 
          name={name} 
          type={showPassword? "text" : "password"} 
          placeholder={placeholder as string || ""} 
          value={value as string} 
          onKeyDown={onKeyDown}
          onChange={v => { 
            if(!disabled && onChange) onChange(v.target.value)
            if(!disabled && onCheckInfo) {
              const { checker, waitTime } = onCheckInfo(v.target.value)
              //only check input in "onChange" if waitTime is greater than zero.
              // This is good in searching a text results as a user types in a search bar, 
              // or saving an article on a server as the user types
              if(waitTime > 0) {
                handleInputCheck(() => `${v.target.value}`, (checkedValue) => {
                  return checkedValue === v.target.value
                }, checker, waitTime)
              }
            }
            
          }} 
          onBlur={v => {
            if(!disabled && onCheckInfo) {
              const { checker, waitTime } = onCheckInfo(v.target.value)
              //only check input in "onBlur" if waitTime is not set or equal to zero.
              // This is good in validating an input as it looses focus when the user moves to another,
              // input field
              if(!waitTime) {
                handleInputCheck(() => `${v.target.value}`, (checkedValue) => {
                  return checkedValue === v.target.value
                }, checker, waitTime)
              }
            }
          }} 
          errorBorderColor='red.300' 
          isInvalid={!nullOrEmpty(errorMessage)} 
        />
        <InputRightElement width="auto" px="0.5rem" children={
          <HStack justifyContent="flex-start" alignItems="center" m="0px !important" p="0px !important">
            {iconRight}
            <Box cursor="pointer" onClick={() => {
              setShowPassword(!showPassword)
            }}>
              {
                !showPassword?
                <FaEyeSlash />
                :
                <FaEye />
              }
            </Box>
          </HStack>
        } />
      </InputGroup>
      :
      type == TYPES.number?
      <InputGroup>
        <InputLeftElement width="auto" px="0.2rem" cursor="pointer" children={
          <HStack justifyContent="flex-start" alignItems="center">
            <Box cursor="pointer" onClick={decreaseNumber} 
            border={{base: "0px", md: "1px"}} 
            borderRadius={{base: "0px", md: "3px"}}
            p={{base: "0px", md: "0.5rem"}}>
              <FaMinus />
            </Box>
            {iconLeft}
          </HStack>
        } />

        <Input onFocus={onFocus} disabled={disabled} ref={inputRef}
          name={name} 
          type={"text"} 
          placeholder={placeholder as string || ""} 
          value={value as number | string} 
          onKeyDown={onKeyDown}
          onChange={(v) => {
            changeNumber(v)
            if(!disabled && onCheckInfo) {
              const { checker, waitTime } = onCheckInfo(v.target.value)
              //only check input in "onChange" if waitTime is greater than zero.
              // This is good in searching a text results as a user types in a search bar, 
              // or saving an article on a server as the user types
              if(waitTime > 0) {
                handleInputCheck(() => `${v.target.value}`, (checkedValue) => {
                  return checkedValue === v.target.value
                }, checker, waitTime)
              }
            }
          }}
          onBlur={v => {
            if(!disabled && onCheckInfo) {
              const { checker, waitTime } = onCheckInfo(v.target.value)
              //only check input in "onBlur" if waitTime is not set or equal to zero.
              // This is good in validating an input as it looses focus when the user moves to another,
              // input field
              if(!waitTime) {
                handleInputCheck(() => `${v.target.value}`, (checkedValue) => {
                  return checkedValue === v.target.value
                }, checker, waitTime)
              }
            }
          }}  
          errorBorderColor='red.300' 
          isInvalid={!nullOrEmpty(errorMessage)} 
        />
        
        <InputRightElement width="auto" px="0.2rem" cursor="pointer"
          children={
          <HStack justifyContent="flex-start" alignItems="center" m="0px !important" p="0px !important">
            {iconRight}
            {
              typeof numberUnit === "string"?
              <Text as="div" textAlign="center" 
              display="flex" justifyContent="flex-start" alignItems="center">
                {numberUnit}
              </Text>
              :
              numberUnit
            }
            <Box cursor="pointer" onClick={increaseNumber} 
            border={{base: "0px", md: "1px"}} 
            borderRadius={{base: "0px", md: "3px"}}
            p={{base: "0px", md: "0.5rem"}}>
              <FaPlus />
            </Box>
          </HStack>
        } />
      </InputGroup>
      :
      type == TYPES.range? 
      <HStack ref={inputRef} justifyContent="space-between" alignItems="center">
        <InputBox onFocus={onFocus} title={minTitle} w="100%" type={TYPES.number} placeholder={rangeMinPlaceholder} 
          value={(value as RangeValue)?.min || 0} onChange={(number) => {
            updateRangeValue(number, "")
          }} 
          numberUnit={numberUnit}
        />
        <Text as="div" alignSelf="flex-end" pb="0.5rem"> ~ </Text>
        <InputBox onFocus={onFocus} title={maxTitle} w="100%" type={TYPES.number} placeholder={rangeMinPlaceholder} 
          value={(value as RangeValue)?.max || 0} onChange={(number) => {
            updateRangeValue("", number)
          }} 
          numberUnit={numberUnit}
        />
      </HStack>
      :
      type == TYPES.textarea? 
      <InputGroup w="100%" h="100%">
        {iconLeft? <InputRightElement children={iconRight} /> : null}
        <Textarea onFocus={onFocus} disabled={disabled} ref={inputRef} w="100%" h="100%" placeholder={placeholder as string} isDisabled={disabled} 
          isInvalid={(errorMessage && errorMessage.length > 0)? true : false} 
          value={value as string} resize={resize} 
          onKeyDown={onKeyDown}
          onChange={v => { 
            if(onChange && !disabled && (!maxTextLimit || isNaN(maxTextLimit) || v.target.value.length < maxTextLimit)) {
              onChange(v.target.value)
            }
            if(!disabled && onCheckInfo && (!maxTextLimit || isNaN(maxTextLimit) || v.target.value.length < maxTextLimit)) {
              const { checker, waitTime } = onCheckInfo(v.target.value)
              //only check input in "onChange" if waitTime is greater than zero.
              // This is good in searching a text results as a user types in a search bar, 
              // or saving an article on a server as the user types
              if(waitTime > 0) {
                handleInputCheck(() => `${v.target.value}`, (checkedValue) => {
                  return checkedValue === v.target.value
                }, checker, waitTime)
              }
            }
            
          }} 
          onBlur={v => {
            if(!disabled && onCheckInfo&& (!maxTextLimit || isNaN(maxTextLimit) || v.target.value.length < maxTextLimit)) {
              const { checker, waitTime } = onCheckInfo(v.target.value)
              //only check input in "onBlur" if waitTime is not set or equal to zero.
              // This is good in validating an input as it looses focus when the user moves to another,
              // input field
              if(!waitTime) {
                handleInputCheck(() => `${v.target.value}`, (checkedValue) => {
                  return checkedValue === v.target.value
                }, checker, waitTime)
              }
            }
          }}
        >
        </Textarea>
        {
          maxTextLimit?
          <InputRightElement width="auto" height="100%" alignItems="flex-end" px="0.2rem" cursor="pointer" children={
            <HStack justifyContent="flex-start" alignItems="center" m="0px !important" p="0px !important">
              {iconRight}
              <Text as="div" opacity="0.4">
                {((value as string || "").length).toLocaleString(locale || "en", {maximumFractionDigits: 0}).replace(new RegExp("[,\.]*", "g"), "")}
                &nbsp;/&nbsp;
                {maxTextLimit.toLocaleString(locale || "en", {maximumFractionDigits: 0}).replace(new RegExp("[,\.]*", "g"), "")}
              </Text>
            </HStack>
          } />
          :
          iconRight? <InputRightElement height="100%" alignItems="flex-end" children={iconRight} /> : null
        }
      </InputGroup>
      :
      type == TYPES.checkbox? 
      <Checkbox onFocus={onFocus} disabled={disabled} ref={inputRef}
        isChecked={value as boolean}
        onChange={(e) => {
          if(!disabled && onChange) onChange(e.target.checked)
          if(!disabled && onCheckInfo) {
            const { checker, waitTime } = onCheckInfo(e.target.checked)
            //only check input in "onChange" if waitTime is greater than zero.
            // This is good in searching a text results as a user types in a search bar, 
            // or saving an article on a server as the user types
            if(waitTime > 0) {
              handleInputCheck(() => e.target.checked, (checkedValue) => {
                return checkedValue === e.target.checked
              }, checker, waitTime)
            }
          }
          
        }} 
        onBlur={e => {
          if(!disabled && onCheckInfo) {
            const { checker, waitTime } = onCheckInfo(e.target.checked)
            //only check input in "onBlur" if waitTime is not set or equal to zero.
            // This is good in validating an input as it looses focus when the user moves to another,
            // input field
            if(!waitTime) {
              handleInputCheck(() => e.target.checked, (checkedValue) => {
                return checkedValue === e.target.checked
              }, checker, waitTime)
            }
          }
        }}
      >
        {title}
      </Checkbox>
      :
      type == TYPES.checklist? 
      <Flex w="100%" flexDirection="row" flexWrap="wrap">
      {
        checklist.map((check, index) => (
          <Checkbox onFocus={onFocus} key={index} disabled={disabled} ref={inputRef} w={{base: "100%", sm: "50%", md: "33.33%"}}
            mb="0.5rem"
            isChecked={check.selected as boolean}
            onChange={(e) => {
              const all = [...checklist]
              all[index].selected = e.target.checked
              if(!disabled && onChange) {
                const onlySelected = []
                for(const selectedService of all) {
                    if(selectedService.selected) {
                        onlySelected.push(selectedService)
                    }
                }
                setChecklist(all)
                onChange(onlySelected)

              }  else {
                setChecklist(all)
              }
              if(!disabled && onCheckInfo) {
                const { checker, waitTime } = onCheckInfo(all)
                //only check input in "onChange" if waitTime is greater than zero.
                // This is good in searching a text results as a user types in a search bar, 
                // or saving an article on a server as the user types
                if(waitTime > 0) {
                  handleInputCheck(() => all, (checkedValue) => {
                    return arraysEqual(checkedValue, all)
                  }, checker, waitTime)
                }
              }
              
            }} 
            onBlur={e => {
              const all = [...checklist]
              all[index].selected = e.target.checked
              if(!disabled && onCheckInfo) {
                const { checker, waitTime } = onCheckInfo(all)
                //only check input in "onBlur" if waitTime is not set or equal to zero.
                // This is good in validating an input as it looses focus when the user moves to another,
                // input field
                if(!waitTime) {
                  handleInputCheck(() => all, (checkedValue) => {
                    return arraysEqual(checkedValue, all)
                  }, checker, waitTime)
                }
              }
            }}
          >
            {onOptionName? onOptionName(check, index) : ""}
          </Checkbox>
        ))
      }
      </Flex>
      :
      type == TYPES.radio? 
      <RadioGroup onFocus={onFocus} ref={inputRef} 
        value={value as string}
        onChange={(v) => {
          if(!disabled && onChange) onChange(v)
          if(!disabled && onCheckInfo) {
            const { checker, waitTime } = onCheckInfo(v)
            //only check input in "onChange" if waitTime is greater than zero.
            // This is good in searching a text results as a user types in a search bar, 
            // or saving an article on a server as the user types
            if(waitTime > 0) {
              handleInputCheck(() => v, (checkedValue) => {
                return checkedValue === v
              }, checker, waitTime)
            }
          }
          
        }} 
        onBlur={v => {
          if(!disabled && onCheckInfo) {
            const { checker, waitTime } = onCheckInfo(v)
            //only check input in "onBlur" if waitTime is not set or equal to zero.
            // This is good in validating an input as it looses focus when the user moves to another,
            // input field
            if(!waitTime) {
              handleInputCheck(() => v, (checkedValue) => {
                return checkedValue === v
              }, checker, waitTime)
            }
          }
        }}>
        <Stack direction={direction || "row"}>
          {
            (options || []).map((v, i) => {
              if(onOptionValue && onOptionName) {
                return (
                  <Radio disabled={disabled} key={i} value={onOptionValue(v, i) as string}>{onOptionName(v, i)}</Radio>
                )

              } else { return null}
            })
          }
        </Stack>
      </RadioGroup>
      :/*
      type == TYPES.location?
      <LocationPicker disabled={disabled} ref={inputRef} w="100%" h="100%" 
        apiKey={apiKey || ""} defaultLatlng={defaultLatlng} geotype={geotype}
        mapToSearchRatio={mapToSearchRatio} 
        twoDigitCountryCode={twoDigitCountryCode} 
        searchPlaceholder={placeholder as string} 
        value={value? {
          name: value.name, 
          formatted_address: value.address,
          geometry: {
            location: {lat: () => value.position.lat, lng: () => value.position.lng},
            viewport: {}
          }
        } : null}
        onChange={(l) => {
          const v = {
            name: l.name,
            address: l.formatted_address,
            position: {
              lat: l.geometry.location.lat(),
              lng: l.geometry.location.lng()
            }
          }
          if(!disabled && onChange) {
            onChange(v)
          }
          if(!disabled && onCheckInfo) {
            const { checker, waitTime } = onCheckInfo(v)
            //only check input in "onChange" if waitTime is greater than zero.
            // This is good in searching a text results as a user types in a search bar, 
            // or saving an article on a server as the user types
            if(waitTime > 0) {
              handleInputCheck(() => v, (checkedValue) => {
                return JSON.stringify(checkedValue) === JSON.stringify(v)
              }, checker, waitTime)
            }
          }
          
        }} 
        onBlur={(l) => {
          if(!disabled && onCheckInfo) {
            const v = {
              name: l.name,
              address: l.formatted_address,
              position: {
                lat: l.geometry.location.lat(),
                lng: l.geometry.location.lng()
              }
            }

            const { checker, waitTime } = onCheckInfo(v)
            //only check input in "onBlur" if waitTime is not set or equal to zero.
            // This is good in validating an input as it looses focus when the user moves to another,
            // input field
            if(!waitTime) {
              handleInputCheck(() => v, (checkedValue) => {
                return JSON.stringify(checkedValue) === JSON.stringify(v)
              }, checker, waitTime)
            }
          }
        }}
        errorMessage={errorMessage}
      />
      :*/
      type == TYPES.price?
      <VStack w="100%" justifyContent="flex-start" alignItems="center">
        <InputGroup>
          <InputLeftElement width="auto" px="0.2rem" cursor="pointer" children={
            <HStack justifyContent="flex-start" alignItems="center">
              <Box cursor="pointer" onClick={decreaseNumber} 
              border={{base: "0px", md: "1px"}} 
              borderRadius={{base: "0px", md: "3px"}}
              p={{base: "0px", md: "0.5rem"}}>
                <FaMinus />
              </Box>
              {iconLeft}
            </HStack>
          } />

          <Input onFocus={onFocus} disabled={disabled} ref={inputRef}
            name={name} 
            type={"text"} 
            placeholder={placeholder as string || ""} 
            value={value as number | string} 
            onKeyDown={onKeyDown}
            onChange={(v) => {
              changeNumber(v)
              if(!disabled && onCheckInfo) {
                const { checker, waitTime } = onCheckInfo(v.target.value)
                //only check input in "onChange" if waitTime is greater than zero.
                // This is good in searching a text results as a user types in a search bar, 
                // or saving an article on a server as the user types
                if(waitTime > 0) {
                  handleInputCheck(() => `${v.target.value}`, (checkedValue) => {
                    return checkedValue === v.target.value
                  }, checker, waitTime)
                }
              }
            }}
            onBlur={v => {
              if(!disabled && onCheckInfo) {
                const { checker, waitTime } = onCheckInfo(v.target.value)
                //only check input in "onBlur" if waitTime is not set or equal to zero.
                // This is good in validating an input as it looses focus when the user moves to another,
                // input field
                if(!waitTime) {
                  handleInputCheck(() => `${v.target.value}`, (checkedValue) => {
                    return checkedValue === v.target.value
                  }, checker, waitTime)
                }
              }
            }}  
            errorBorderColor='red.300' 
            isInvalid={!nullOrEmpty(errorMessage)} 
          />
          
          <InputRightElement width="auto" px="0.2rem" cursor="pointer"
            children={
            <HStack justifyContent="flex-start" alignItems="center" m="0px !important" p="0px !important">
              {iconRight}
              {
                typeof numberUnit === "string"?
                <Text as="div" textAlign="center" 
                display="flex" justifyContent="flex-start" alignItems="center">
                  {numberUnit}
                </Text>
                :
                numberUnit
              }
              <Box cursor="pointer" onClick={increaseNumber} 
              border={{base: "0px", md: "1px"}} 
              borderRadius={{base: "0px", md: "3px"}}
              p={{base: "0px", md: "0.5rem"}}>
                <FaPlus />
              </Box>
            </HStack>
          } />
        </InputGroup>
      </VStack>
      :/*
      type == TYPES.select_tree?
      <SelectTree disabled={disabled} options={options as SelectTreeOptionWithChildren[]} 
      onChange={onChange}
      onBlur={(e: SelectTreeEvent) => {
        const { currentNode, selectedNodes } = e
        if(!disabled && onCheckInfo) {
          const v = "currentNode"

          const { checker, waitTime } = onCheckInfo(v)
          //only check input in "onBlur" if waitTime is not set or equal to zero.
          // This is good in validating an input as it looses focus when the user moves to another,
          // input field
          if(!waitTime) {
            handleInputCheck(() => v, (checkedValue) => {
              return JSON.stringify(checkedValue) === JSON.stringify(v)
            }, checker, waitTime)
          }
        }
      }}
      />
      :*/
      type == TYPES.none?
      null
      :
      <InputGroup>
        {iconLeft? <InputRightElement children={iconLeft} /> : null}
        <Input onFocus={onFocus} disabled={disabled} ref={inputRef} 
          name={name} 
          type={type} 
          placeholder={placeholder as string || ""} 
          value={value as string | number | string[]} 
          onChange={v => {
            if(!disabled && onChange) onChange(v.target.value)
            if(!disabled && onCheckInfo) {
              const { checker, waitTime } = onCheckInfo(v.target.value)
              //only check input in "onChange" if waitTime is greater than zero.
              // This is good in searching a text results as a user types in a search bar, 
              // or saving an article on a server as the user types
              if(waitTime > 0) {
                handleInputCheck(() => `${v.target.value}`, (checkedValue) => {
                  return checkedValue === v.target.value
                }, checker, waitTime)
              }
            }
            
          }} 
          onBlur={v => {
            if(!disabled && onCheckInfo) {
              const { checker, waitTime } = onCheckInfo(v.target.value)
              //only check input in "onBlur" if waitTime is not set or equal to zero.
              // This is good in validating an input as it looses focus when the user moves to another,
              // input field
              if(!waitTime) {
                handleInputCheck(() => `${v.target.value}`, (checkedValue) => {
                  return checkedValue === v.target.value
                }, checker, waitTime)
              }
            }
          }}
          errorBorderColor='red.300' 
          isInvalid={!nullOrEmpty(errorMessage)}
        />
        {iconRight? <InputRightElement children={iconRight} /> : null}
      </InputGroup>
    }
    {
      nullOrEmpty(errorMessage) || type == TYPES.location? null : 
      <FormErrorMessage>
          {errorMessage}
      </FormErrorMessage>
    }
    {
      nullOrEmpty(helperText) || type == TYPES.location? null : 
      <FormHelperText>{helperText}</FormHelperText>
    }
    <style>
      {`
        .cursor-not-allowed-deep {
          cursor: not-allowed !important;
        }
        .cursor-not-allowed-deep * {
          cursor: not-allowed;
        }
      `
      }
    </style>
  </FormControl>
)
}

InputBox.TYPES = TYPES

export default InputBox