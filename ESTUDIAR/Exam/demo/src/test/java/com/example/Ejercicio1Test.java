package com.example;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class Ejercicio1Test {
    @Test
    void testClasificar() {
        assertEquals("IMPARES", Ejercicio1.clasificar(11, 21));

    }
}
