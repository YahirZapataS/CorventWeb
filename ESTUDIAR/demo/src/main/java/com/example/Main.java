
/*Realiza un programa que utilice Selenium WebDriver para lo siguiente:
Ingresa al enlace: http://www.pino.mx/act25/lista.php
Recupera cada nombre y apellido.
Para cada nombre y apellidos, realiza lo siguiente:
Ir a la dirección: http://www.pino.mx/act25/registro01.php
Ingresar el nombre y apellidos en los cuadros de texto y envía el formulario. */
package com.example;

import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class Main {
    public static void main(String[] args) {
        System.setProperty("webdriver.chrome.driver","C:\\Users\\rocae\\Documents\\CorventWeb\\ESTUDIAR\\demo\\src\\main\\resources\\chromedriver.exe");
        WebDriver driver = new ChromeDriver(); 
        driver.get("http://www.pino.mx/act25/lista.php");
        List<String> listaUno = new ArrayList<>();
        List<String> listaDos = new ArrayList<>();

        for(int i =1; i <=16; i++){
            listaUno.add(driver.findElement(By.name("nom_"+ i)).getAttribute("value"));
            listaDos.add(driver.findElement(By.name("ap_"+ i)).getAttribute("value"));
         
        }
        
        for(int i =0; i <16; i++){
            driver.get("http://www.pino.mx/act25/registro01.php");
            driver.findElement(By.name("nombre")).sendKeys(listaUno.get(i));
            driver.findElement(By.name("apellidos")).sendKeys(listaDos.get(i));
            driver.findElement(By.name("Enviar")).click();
            driver.findElement(By.name("confirmacion")).getAttribute("value");
            String codigo = driver.findElement(By.name("confirmacion")).getAttribute("value");
            System.out.println(listaUno.get(i) + listaDos.get(i) + codigo);
        }



    
        


    

        System.out.println("Hello world!");
    }
}