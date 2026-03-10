package com.proyecto.Compra.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor

public class WeatherDTO {
    private Double latitude;
    private Double longitude;
    private Double elevation;

    @JsonProperty("generationtime_ms")
    private Double generationtimeMs;

    @JsonProperty("utc_offset_seconds")
    private Integer utcOffsetSeconds;

    private String timezone;

    @JsonProperty("timezone_abbreviation")
    private String timezoneAbbreviation;

private Current current;

    @JsonProperty("current_units")
    private CurrentUnits currentUnits;

    private Daily daily;

    @JsonProperty("daily_units")
    private DailyUnits dailyUnits;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor

    public static class Current {
        private String time;

        private Integer interval;

        @JsonProperty("temperature_2m")
        private Double temperature2m;

        @JsonProperty("relative_humidity_2m")
        private Integer relativeHumidity2m;

        @JsonProperty("is_day")
        private Integer isDay;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CurrentUnits {
        private String time;

        private String interval;

        @JsonProperty("temperature_2m")
        private String temperature2m;

        @JsonProperty("relative_humidity_2m")
        private String relativeHumidity2m;

        @JsonProperty("is_day")
        private String isDay;
    }

@Data
    @AllArgsConstructor
    @NoArgsConstructor

    public static class Daily {
        private List<String> time;

        @JsonProperty("weather_code")
        private List<Integer> weatherCode;

        @JsonProperty("temperature_2m_max")
        private List<Double> temperature2mMax;

        @JsonProperty("temperature_2m_min")
        private List<Double> temperature2mMin;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DailyUnits {
        private String time;

        @JsonProperty("weather_code")
        private String weatherCode;

        @JsonProperty("temperature_2m_max")
        private String temperature2mMax;

        @JsonProperty("temperature_2m_min")
        private String temperature2mMin;
    }
}
